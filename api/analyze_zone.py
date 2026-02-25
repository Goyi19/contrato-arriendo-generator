from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import googlemaps
from time import sleep, time
import math
import io
import os
import sys
import base64

# Agregar la ruta base para que encuentre categories_config
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from categories_config import CATEGORIES_CONFIG
except ImportError:
    CATEGORIES_CONFIG = {"Comercial": {}, "Fuentes de Flujo": {}}

app = Flask(__name__)
CORS(app)

def calculate_distance(lat1, lng1, lat2, lng2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lng2 - lng1)
    a = math.sin(delta_phi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda/2)**2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))

class BuscadorLugares:
    def __init__(self, api_key: str):
        self.gmaps = googlemaps.Client(key=api_key)
        self.resultados = []
        self.places_ids_vistos = set()
        
    def buscar_con_paginacion(self, ubicacion: tuple, radio: int, tipo: str = None, keyword: str = None, cat_name: str = "N/A"):
        try:
            if tipo:
                resultado = self.gmaps.places_nearby(location=ubicacion, radius=radio, type=tipo)
            else:
                resultado = self.gmaps.places_nearby(location=ubicacion, radius=radio, keyword=keyword)
                
            self._procesar_resultados(resultado.get('results', []), cat_name, ubicacion)
            
            paginas_adicionales = 0
            while 'next_page_token' in resultado and paginas_adicionales < 2:
                sleep(2)  # Delay obligatorio para 'next_page_token'
                next_token = resultado['next_page_token']
                resultado = self.gmaps.places_nearby(page_token=next_token)
                
                nuevos = len(resultado.get('results', []))
                if nuevos > 0:
                    self._procesar_resultados(resultado.get('results', []), cat_name, ubicacion)
                
                paginas_adicionales += 1
                
        except Exception as e:
            print(f"Error en búsqueda: {str(e)}")
            
    def _procesar_resultados(self, resultados, cat_name, modo, ubicacion_centro):
        for lugar in resultados:
            place_id = lugar.get('place_id')
            
            # Evitar duplicados
            if place_id in self.places_ids_vistos:
                continue
                
            self.places_ids_vistos.add(place_id)
            
            nombre = lugar.get('name', 'Sin nombre')
            direccion = lugar.get('vicinity', 'Sin dirección')
            lat = lugar['geometry']['location']['lat']
            lng = lugar['geometry']['location']['lng']
            tipo_google = ', '.join(lugar.get('types', [])[:3])
            
            # Distance filter internally
            dist = calculate_distance(ubicacion_centro[0], ubicacion_centro[1], lat, lng)
            
            self.resultados.append({
                'Nombre': nombre,
                'Dirección': direccion,
                'Categoría': cat_name,
                'Modo': modo,
                'Tipo Google': tipo_google,
                'Latitud': lat,
                'Longitud': lng,
                '_distancia_centro': dist
            })

@app.route('/api/analyze_zone', methods=['POST'])
def analyze_zone():
    start_time = time()
    try:
        data = request.json
        api_key = data.get('api_key')
        if not api_key:
            return jsonify({"error": "Google Maps API Key is required."}), 400
            
        lat = float(data.get('lat'))
        lng = float(data.get('lng'))
        radius = int(data.get('radius'))
        modo = data.get('modo') 
        selected_cats = data.get('categories', []) # Now a list of dicts: [{'id': '...', 'modo': '...'}, ...]
        
        if radius > 3000:
            radius = 3000
            
        buscador = BuscadorLugares(api_key)
        
        for cat_item in selected_cats:
            cat_id = cat_item.get('id')
            item_modo = cat_item.get('modo')
            
            grupo_config = CATEGORIES_CONFIG.get(item_modo, {})
            cat_config = grupo_config.get(cat_id)
            if not cat_config:
                continue
                
            name = cat_config.get('descripcion', cat_id)
            
            # Usar 'types_list' para Fuentes de Flujo y 'type' para Comercial
            tipos = cat_config.get('types_list')
            if not tipos and cat_config.get('type'):
                tipos = [cat_config['type']]
                
            keywords = cat_config.get('keywords_list')
            if not keywords and cat_config.get('keyword'):
                keywords = [cat_config['keyword']]
                
            # Sobrescribimos temporalmente _procesar_resultados para pasarle el 'modo'
            # (Un truco rápido ya que Python permite defaults o partials, pero lo pasaremos como estado de clase si fuera necesario)
            # Como '_procesar_resultados' fue modificado arriba para aceptar 'modo', modificamos 'buscar_con_paginacion' 
            # de manera inline si es posible, o simplemente pasamos el 'modo' a _procesar_resultados
            # Espera, 'buscar_con_paginacion' de BuscadorLugares no recibe 'modo'. Vamos a tener que parchearlo temporalmente
            # O mejor, inyectamos el modo en los metodos:
            buscador.current_modo = item_modo # Hacky but works for stateless script
            
            # Re-definir buscar_con_paginacion para que pase el modo:
            def buscar_parcheado(ubicacion, radio, tipo=None, keyword=None, cat_name="N/A"):
                try:
                    if time() - start_time > 8.5:
                        return # Prevenir timeout de Vercel
                    
                    if tipo:
                        resultado = buscador.gmaps.places_nearby(location=ubicacion, radius=radio, type=tipo)
                    else:
                        resultado = buscador.gmaps.places_nearby(location=ubicacion, radius=radio, keyword=keyword)
                    
                    if not resultado: return
                    buscador._procesar_resultados(resultado.get('results', []), cat_name, buscador.current_modo, ubicacion)
                    
                    paginas_adicionales = 0
                    while 'next_page_token' in resultado and paginas_adicionales < 2:
                        # Si sumamos 2 seg de delay, excedemos limite Vercel?
                        if time() - start_time > 6.5:
                            break # No hay tiempo para página 2
                            
                        sleep(2.0)
                        next_token = resultado['next_page_token']
                        resultado = buscador.gmaps.places_nearby(page_token=next_token)
                        if len(resultado.get('results', [])) > 0:
                            buscador._procesar_resultados(resultado.get('results', []), cat_name, buscador.current_modo, ubicacion)
                        paginas_adicionales += 1
                except Exception as e:
                    print(f"Error en búsqueda: {str(e)}")
            
            if tipos:
                for t in tipos:
                    if time() - start_time > 8.5: break
                    buscar_parcheado((lat, lng), radio=radius, tipo=t, cat_name=name)
            if keywords:
                for kw in keywords:
                    if time() - start_time > 8.5: break
                    buscar_parcheado((lat, lng), radio=radius, keyword=kw, cat_name=name)
            
            if time() - start_time > 8.5: 
                break # Sale del loop de categorías si no hay tiempo
        
        # Filtrar distancia max
        df = pd.DataFrame(buscador.resultados)
        if not df.empty:
            df = df[df['_distancia_centro'] <= radius].copy()
            df = df.drop(columns=['_distancia_centro']) # cleaning
            df = df.drop_duplicates(subset=['Nombre', 'Latitud', 'Longitud'], keep='first')
        else:
            # Empty frame headers
            df = pd.DataFrame(columns=['Nombre', 'Dirección', 'Categoría', 'Modo', 'Tipo Google', 'Latitud', 'Longitud'])
            
        # Retornar JSON con excel_b64 y datos para marcadores
        output = io.BytesIO()
        df.to_excel(output, index=False)
        excel_b64 = base64.b64encode(output.getvalue()).decode('utf-8')
        
        # Omitir lugares sin lat/lng
        places = df[['Nombre', 'Latitud', 'Longitud', 'Categoría', 'Modo']].dropna(subset=['Latitud', 'Longitud']).to_dict(orient='records')
        
        return jsonify({
            "places": places,
            "excel_b64": excel_b64,
            "total": len(places)
        })
        
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({"error": f"Error del servidor: {str(e)}"}), 500
        
if __name__ == '__main__':
    app.run(debug=True, port=5000)
