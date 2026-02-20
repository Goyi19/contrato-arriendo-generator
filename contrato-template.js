/* ═══════════════════════════════════════════════════
   ContratoAI — Plantilla Base del Contrato de Arriendo
   ═══════════════════════════════════════════════════
   
   CÓMO PERSONALIZAR ESTA PLANTILLA:
   ----------------------------------
   Este archivo contiene la plantilla legal EXACTA Y COMPLETA de tu contrato.
   Los "placeholders" como {{ARRENDATARIO_NOMBRE}} serán reemplazados
   automáticamente. Gemini ajustará la gramática (singular/plural, 
   artículos) cuando envíes una o varias oficinas.
   ═══════════════════════════════════════════════════ */

const CONTRATO_TEMPLATE = `
CONTRATO DE ARRENDAMIENTO
INVERSIONES CIENFUEGOS 151 SpA
Y
{{ARRENDATARIO_NOMBRE}}

En Santiago de Chile, a {{FECHA_CONTRATO}}, comparecen: 
INVERSIONES CIENFUEGOS 151 SpA, sociedad del giro de su denominación, Rol Único Tributario número 77.209.241-5, representada por don Boris Candia Álvarez, cédula de identidad número 13.146.034-1, y por don José Ignacio Bezanilla Zañartu, chileno, casado, ingeniero civil industrial, cédula de identidad número 15.959.368-1, todos con domicilio, para efectos del presente instrumento, en calle Américo Vespucio Norte número 1090, comuna de Vitacura, ciudad de Santiago, en adelante denominada la "Arrendadora" o el "Arrendador", por una parte, y por la otra,
{{ARRENDATARIO_NOMBRE}}, Rol Único Tributario número {{ARRENDATARIO_RUT}}, sociedad del giro de su denominación{{ARRENDATARIO_REPRESENTANTE_TEXTO}}, con domicilio para efectos del presente instrumento, en {{ARRENDATARIO_DOMICILIO}}, en adelante también e indistintamente el "Arrendatario" o la "Arrendataria"; 
los comparecientes mayores de edad, quienes acreditan su identidad con las cédulas antes indicadas y exponen: 

PRIMERO: Antecedentes.
La Arrendadora es dueña de {{OFICINAS_TEXTO}} ubicada(s) en el {{PISO}}, y conjuntamente el/los estacionamiento(s) {{ESTACIONAMIENTOS_TEXTO}} del cuarto subterráneo, del Edificio "Business Center" ubicado en la comuna de Las Condes, Santiago, cuyos accesos son por (a) Avenida Isabel La Católica N°4394 y por (b) Avenida Américo Vespucio N°1307, en adelante, el "Edificio".

SEGUNDO: Arrendamiento.
La Arrendadora, debidamente representada en la forma indicada en la comparecencia, da y entrega en arrendamiento al Arrendatario, quien debidamente representado acepta y toma en arrendamiento, {{OFICINAS_TEXTO}} del {{PISO}} y estacionamiento(s) {{ESTACIONAMIENTOS_TEXTO}} del cuarto subterráneo, con los bienes muebles singularizados en el anexo número 1 que se entiende formar parte integrante del presente contrato (en adelante el "Anexo 1"), ubicado en el Edificio "Business Center".
{{SUPERFICIE_TEXTO}} según plano aprobado por la Dirección de Obras Municipales de la Ilustre Municipalidad de Las Condes, la que se entrega y arrienda habilitada y amoblada con los bienes indicados en el Anexo 1, en adelante denominadas la "Unidad Arrendada" o el "Inmueble Arrendado" o el "Inmueble".
El Arrendatario declara conocer perfectamente la ubicación, dimensiones y demás características y condiciones del Inmueble Arrendado, renunciando a cualquier acción, reclamación o recurso por este concepto.

TERCERO: Autorizaciones y permisos.
Se deja constancia que la tramitación y obtención de patentes, autorizaciones, certificados y permisos por parte de la autoridad es de exclusiva responsabilidad del Arrendatario, como, asimismo, la documentación necesaria para la obtención de los mismos.
La falta o la imposibilidad de obtener las autorizaciones, permisos o patentes necesarios para el desarrollo de la actividad económica del Arrendatario, no dará derecho a este último para solicitar el término anticipado del contrato ni derecho a indemnización alguna.
Se deja constancia que toda tramitación, instalación, obra, derechos, tasas, honorarios, accesorios, artefactos, estructuras, etcétera que puedan producirse o requerirse serán de cargo, responsabilidad y costo exclusivo de la Arrendataria.

CUARTO: Vigencia y duración del contrato.
El presente Contrato comenzará a regir desde esta fecha y se mantendrá vigente durante un plazo de {{PLAZO_MESES}} meses, el cual se renovará tácita y automática por periodos iguales y sucesivos, salvo que alguna de las Partes comunique a la otra por escrito su intención de ponerle término al presente contrato, con a lo menos {{DIAS_AVISO}} días de anticipación a la fecha de vencimiento del plazo original o de alguna de sus prórrogas.

QUINTO: Renta.
La renta de arrendamiento mensual será la suma única y total de {{MONTO_RENTA_UF}} Unidades de Fomento más el Impuesto al Valor Agregado aplicable, en adelante "IVA".
El pago se hará mediante depósito o transferencia electrónica en la cuenta corriente 77393340 del Banco Santander a nombre de la Arrendadora, con aviso a los mails: itrujillo@ibrick.cl, y fcorrea@ibrick.cl.
En caso de no existir fijación oficial del valor de la Unidad de Fomento a la fecha de pago, reajustado conforme a la variación que experimente el Índice de Precios al Consumidor emanado del Instituto Nacional de Estadísticas o el Organismo que lo suceda o reemplace, entre la fecha que hubiere regido ese último valor y el del pago efectivo.
Las partes convienen, para todos los efectos legales a que hubiere lugar, que servirán de recibo de pago de la renta mensual de arrendamiento: a) Los documentos que al efecto emita la Arrendadora como recibos de pago, b) El comprobante de depósito o de transferencia en la cuenta corriente bancaria de la Arrendadora; o c) La certificación mensual o cartola emitida por una institución bancaria en la cual se indique el hecho de haberse efectuado un depósito en la cuenta corriente bancaria de la Arrendadora.
La Arrendataria quedará obligada a pagar íntegramente las rentas de arrendamiento durante la vigencia del Contrato aun cuando no haga uso del Inmueble Arrendado, a menos que la falta de uso del Inmueble Arrendado se deba a causas atribuibles a la culpa o dolo de la Arrendadora.

SEXTO: Multas e intereses.
El simple retardo en el pago de toda o parte de una renta de arrendamiento del contrato, constituirá en mora a la Arrendataria, debiendo pagar sobre la renta mensual, el interés máximo convencional que la ley permite estipular para operaciones reajustables de dinero, sin perjuicio del pago de una multa equivalente al {{PORCENTAJE_MULTA_ATRASO}}% de la renta pactada por cada día de atraso en el pago de la renta, suma que deberá ser pagada en conjunto con la renta adeudada.
De la misma forma, será de cargo de la Arrendataria toda multa que pueda impartir la autoridad o la administración del Edificio, en razón del uso de su unidad.
La Arrendataria se obliga a reembolsar a la Arrendadora todos los gastos en que ésta incurra que sean de cargo de la Arrendataria y/o gastos directos en que la Arrendadora pueda incurrir por concepto de multa o indemnizaciones por causa o hechos de responsabilidad de la Arrendataria, debidamente reajustados en la misma variación que experimentó la unidad de fomento entre la fecha del gasto y la de su reembolso efectivo, más los intereses corrientes.

SÉPTIMO: Giro y destino del Inmueble.
El Inmueble Arrendado será destinado única y exclusivamente a oficina y estacionamiento, según corresponde, prohibiéndose todas las actividades que contravengan la ley y el Reglamento de Copropiedad del Edificio.
Las partes acuerdan elevar esta cláusula a la calidad de esencial.
Cualquier incumplimiento por parte de la Arrendataria de esta obligación dará derecho a la Arrendadora para poner término ipso-facto al presente contrato y a exigir las indemnizaciones correspondientes a todo tipo de perjuicio que pueda sufrir la Arrendadora o los demás propietarios y/o arrendatarios por el incumplimiento.
Queda prohibido destinar el inmueble a casa de masajes, habitaciones, comercio sexual y demás actividades similares, y cualquier otra actividad que se prohíba expresamente en el Reglamento de Copropiedad o se encuentre prohibida por la comunidad del Edificio.
Para efectos de acreditar dichos destinos bastará 3 reclamos de distintos usuarios del Edificio en el libro de reclamos de la conserjería con sus respectivas denuncias/constancia ante Carabineros de Chile.
Estampados los reclamos, el Arrendador tendrá derecho a poner término anticipado al contrato sin derecho a indemnización alguna a favor del Arrendatario.
Queda expresamente prohibido al Arrendatario subarrendar o ceder la tenencia de todo o parte del Inmueble Arrendado.

OCTAVO: Entrega Material.
Se deja expresamente establecido que la Arrendadora entregó al Arrendador el Inmueble en este acto, habilitado y amoblado, totalmente desocupado, con todos sus gastos comunes, consumos básicos y domiciliarios al día.

NOVENO: Declaración.
El Arrendatario declara conocer y aceptar el Reglamento de Copropiedad de Edificio y se obliga por este acto a cumplir con todas y cada una de sus disposiciones, como asimismo, las obligaciones contenidas en los acuerdos adoptados por las asambleas de copropietarios, así como las demás normas de funcionamiento, instrucciones, especificaciones técnicas y/o restricciones que hayan sido establecidas o se establezcan en el futuro en toda acta, acuerdo, resolución, ordenanza, reglamento y en general por cualquier disposición o norma que afecte directa o indirectamente a las oficinas, estacionamientos y/o bodegas, como también respetar los derechos de los copropietarios del Edificio.
Esta declaración es elevada por las partes a la calidad de esencial.
De la misma forma, el Arrendatario declara haber visitado e inspeccionado el Inmueble objeto de este contrato, expresando que se encuentra conforme y sin observaciones que formular al respecto.
Por último, se deja expresa constancia que las disposiciones contenidas en el Reglamento de Copropiedad del Edificio forman parte integrante del presente contrato y se entienden íntegramente reproducidas en este documento.

DÉCIMO: Obligaciones de la Arrendataria.
Serán obligaciones de la Arrendataria, sin perjuicio de las demás obligaciones que emanen del presente Contrato o la ley, las siguientes:
/Uno/ Pagar en tiempo y forma la totalidad de las rentas de arrendamiento.
/Dos/ Pagar en tiempo y forma los consumos domiciliarios de energía eléctrica, agua, gastos comunes, y otros que procedieren, a la o las empresas, personas o entidades que corresponda relativos al Inmueble Arrendado. El atraso de dos meses en cualquiera de los pagos indicados dará derecho a la Arrendadora para suspender los servicios respectivos.
/Tres/ Destinar el Inmueble Arrendado única y exclusivamente al desarrollo de las actividades relacionadas con su giro, así como la instalación de equipos relacionados con su giro.
/Cuatro/ Restituir el Inmueble Arrendado en tiempo y forma, esto es, en buenas condiciones y estado, habida consideración al desgaste natural por el uso legítimo y el transcurso del tiempo.
/Cinco/ Mantener el Inmueble Arrendado asegurado en los términos a que alude la cláusula Décima siguiente.
/Seis/ Informar a la Arrendadora de inmediato y en cuanto lleguen a su conocimiento la existencia de impugnaciones, turbaciones o amenazas al dominio o posesión del Inmueble Arrendado y/o la existencia de reclamos o litigios de cualquier naturaleza que lleguen a su conocimiento y se relacionen con los mismos.
/Siete/ Cumplir con las obligaciones que establezca el Reglamento Interno.

UNDÉCIMO: Prohibiciones de la Arrendataria.
Quedará prohibido a la Arrendataria ejecutar los siguientes hechos, actos y contratos:
/Uno/ Introducir al Inmueble Arrendado mejoras, modificaciones o alteraciones de cualquier clase o naturaleza, sin previa autorización por escrito de la Arrendadora.
/Dos/ Destinar el Inmueble Arrendado, aunque sea esporádica o transitoriamente, a una finalidad diferente de su giro. Asimismo, le queda prohibido cambiar el destino para el cual fue arrendado.
/Tres/ Causar molestias a los ocupantes del edificio y demás locatarios.
/Cuatro/ Introducir o mantener en el Inmueble Arrendado sustancias químicas o materiales explosivos, inflamables, de mal olor, peligrosos o corrosivos o que perjudiquen directa o indirectamente la salud, salubridad e higiene de los ocupantes del edificio y demás locatarios, o que afecten a las personas o a los inmuebles que conforman el edificio. Asimismo, le queda prohibido a la Arrendataria introducir animales en el edificio.
/Cinco/ Incumplir o violar las normas y/o prohibiciones que se establezcan en el Reglamento Interno.

DUODÉCIMO: Ingreso al Inmueble arrendado.
El Arrendatario acepta y autoriza expresamente al Administrador del Edificio para ingresar a la unidad arrendada cuando ésta se encuentre vacía o el Arrendatario no sea habido, sin notificación previa ni autorización alguna, con facultades para descerrajar e inclusive destruir los elementos que impidan el paso a ella cuando exista el riesgo, amenaza o presunción de peligro, filtración, explosión, inundaciones, emanaciones y otros desperfectos.
El Arrendatario se obliga a tomar todas las medidas tendientes a evitar situaciones que ameriten el ingreso al Inmueble Arrendado.

DÉCIMO TERCERO: Gastos.
Será obligación del Arrendatario desde esta fecha y hasta la fecha de su restitución efectiva, el pago puntual al Administrador del Edificio o a quien corresponda, de las cuotas de gastos comunes del Inmueble Arrendado y de las cuentas de servicios básicos tales como electricidad, calefacción, agua potable fría o caliente, alcantarillado, extracción de basura, telefonía, internet, televisión satelital o por cable, multas y/o demás consumos que no queden incluidos en el cobro de los gastos comunes o servicios especiales.
El atraso de un mes en los pagos de los servicios indicados y/o en el pago de los gastos comunes, dará derecho a la Arrendadora para solicitar la suspensión de los servicios básicos, en especial la electricidad, agua potable, telefonía, internet, televisión satelital o por cable, entre otros y a cobrar dentro de la renta los reajustes e intereses de reposición que cobre la compañía respectiva.
Para los efectos señalados en esta cláusula la Arrendataria otorga mandato irrevocable a la Arrendadora para solicitar a la autoridad que corresponda, a la administración de la comunidad y/o comité de administración de la misma y a cualquiera compañía o empresa de cualquier naturaleza, en especial de electricidad, agua potable, telefonía y de comunicación, el corte de los suministros de los mencionados servicios.
De la misma forma, igual mandato irrevocable se otorga al Administrador del Edificio y se le faculta y autoriza expresamente para proceder a la suspensión de los servicios básicos que puedan ser interrumpidos por sistemas propios de control y para el paso al Inmueble Arrendado a cualquier autoridad o compañía.

DÉCIMO CUARTO: Cláusula Penal.
Las Partes pactan que en caso de incurrir alguna de ellas en incumplimiento de las obligaciones que para ellas emanan del presente Contrato, se procederá según se indica a continuación:
/Uno/ Incumplimiento de las obligaciones principales de la Arrendataria.
/A/ El incumplimiento de cualquiera de las obligaciones principales que en virtud del presente Contrato de arrendamiento le corresponden a la Arrendataria, de conformidad con lo señalado en la letra /B/ siguiente y sin que esta enumeración sea taxativa, facultará a la Arrendadora para ejercer, a su opción, cualquiera de los siguientes derechos que podrá ejercer a su sola discreción:
/i/ A dar por terminado ipso-facto el Contrato, sin necesidad de trámite ni declaración judicial alguna y, por lo tanto, a exigir la inmediata restitución del Inmueble Arrendado, a exigir el pago de todas las rentas de arrendamiento que se encuentren vencidas a la fecha del incumplimiento y adicionalmente, sin necesidad de trámite ni declaración alguna, a exigir el pago de una suma correspondiente al veinticinco por ciento de las rentas adeudadas; o
/ii/ A exigir el cumplimiento forzado del Contrato de arrendamiento y adicionalmente por concepto de multa o cláusula penal compensatoria y a título de indemnización de los perjuicios avaluados anticipadamente y de común acuerdo por las Partes, a exigir una suma correspondiente al veinticinco por ciento de las rentas adeudadas, sin perjuicio del derecho a exigir, además, el pago de todas las rentas de arrendamiento que se encuentren vencidas a la fecha del incumplimiento.
Lo estipulado en esta cláusula es sin perjuicio del derecho de la Arrendadora de cobrar intereses moratorios, en los términos establecidos en la cláusula Décimo Quinta siguiente.
/B/ Las obligaciones principales que en virtud del presente Contrato de arrendamiento le corresponden a la Arrendataria, y a las que se refiere la letra /A/ anterior, son las siguientes:
/i/ el pago en tiempo y forma de las rentas mensuales de arrendamiento;
/ii/ el cumplimiento de las obligaciones indicadas en la cláusula Décima anterior;
/iii/ dar al Inmueble Arrendado en forma permanente y sin interrupciones, el uso o destino que se tuvo a la vista al momento de contratar;
/iv/ la mantención del Inmueble Arrendado en buen estado de conservación, la ejecución de las reparaciones necesarias en un breve y prudente plazo, con el objeto de evitar o causar a estos daños o perjuicios relevantes especialmente provocando su deterioro o destrucción; y/o
/v/ no violar las prohibiciones indicadas en la cláusula Undécima anterior.
/Dos/ Incumplimiento de las obligaciones principales asumidas por la Arrendadora.
/A/ El incumplimiento de cualquiera de las obligaciones principales que en virtud del presente Contrato de arrendamiento le corresponden a la Arrendadora, de conformidad con lo señalado en la letra /B/ siguiente facultará a la Arrendataria para ejercer, a su opción, cualquiera de los siguientes derechos que podrá ejercer a su sola discreción:
/i/ A dar por terminado ipso-facto el Contrato, sin necesidad de trámite ni declaración judicial alguna; o
/ii/ A exigir el cumplimiento forzado del Contrato de arrendamiento.
/B/ Las obligaciones principales que en virtud del presente Contrato de arrendamiento le corresponden a la Arrendadora, y a las que se refiere la letra /A/ anterior, son las siguientes:
/i/ entregar el Inmueble Arrendado;
/ii/ liberar al Arrendatario de toda turbación o embarazo en el goce de la cosa arrendada, en especial aquella derivada de la notificación de desahucio del Inmueble Arrendado en virtud de haberse hecho efectiva alguna de las hipotecas que gravan el Inmueble Arrendado.
/Tres/ Disposiciones comunes.
/A/ Las indemnizaciones de perjuicios de que da cuenta la presente cláusula se pagarán en Unidades de Fomento, en su equivalente en pesos moneda corriente de curso legal, según la paridad de la unidad de fomento informada por el Banco Central de Chile o el organismo que lo reemplace o subrogue en esa función, vigente al día del pago efectivo y en caso de oposición, a más tardar, dentro del tercer día hábil bancario de ejecutoriado el fallo arbitral que condene a su pago.
/B/ Con todo, en caso de incumplimiento de cualquiera de las Partes de las obligaciones principales o accesorias a que alude esta cláusula, la parte diligente deberá comunicar en forma previa y por carta certificada a la parte incumplidora que se encuentra en mora o atraso en el cumplimiento de alguna de las obligaciones del presente Contrato al domicilio señalado en la cláusula Vigésimo Quinta siguiente.
Si el incumplimiento persistiere después de veinte días contados desde la recepción de la communication citada anteriormente, se procederá sin más trámite a hacer efectivas las cláusulas penales pactadas en esta cláusula, aun cuando respecto de las obligaciones de dinero, los intereses se devengarán desde la fecha del incumplimiento.
De este modo, para ejercer los derechos contenidos en los párrafos /Uno/ y /Dos/ será necesario que previamente se realicen las comunicaciones indicadas en este párrafo.
/C/ Para los efectos de esta cláusula la Arrendadora queda expresamente facultada para imputar al pago de las multas correspondientes a la cláusula penal pactada el valor de las garantías estipuladas en el presente Contrato.

DÉCIMO QUINTO: Intereses Moratorios.
Cualquier pago o reembolso que realicen las Partes con posterioridad a las fechas pactadas en este Contrato, dará derecho a la otra parte a cobrar el interés máximo que la ley permite estipular para operaciones reajustables, sobre el total de la obligación insoluta y hasta la fecha de su pago efectivo, sin perjuicio del reajuste que proceda, si éste no se hubiera pactado a su respecto, el que se determinara aplicando la variación que hubiese experimentado la Unidad de Fomento entre la fecha en que el pago debió efectuarse y la fecha en que se haga efectivo o, en caso que dicha unidad dejare de existir, de acuerdo a la variación que experimente el Índice de Precios al Consumidor durante el mismo período.

DÉCIMO SEXTO. Modificación, mantención, mejoras, y conservación del Inmueble.
La Arrendataria, previa autorización escrita de la Arrendadora, podrá efectuar las modificaciones y mejoras necesarias para su funcionamiento como oficina propia de su rubro.
Todas las mejoras, cualquiera sea su naturaleza y sea que se realicen serán de cargo de la Arrendataria y, al término del arrendamiento quedarán a beneficio exclusivo de la Arrendadora, quien nada adeudará por ellas, salvo que dichas mejoras se puedan separar sin detrimento de la propiedad, caso en el cual, la Arrendataria estará autorizada para desprenderlas en su propio beneficio, a menos que la Arrendadora esté dispuesta a abonarle lo que valdrían los materiales considerándolos separadamente.
La Arrendataria se obliga a mantener el Inmueble Arrendado en perfecto estado de conservación, aseo y funcionamiento, obligándose a efectuar, de su cuenta y cargo las reparaciones locativas para mantener el Inmueble Arrendado en el estado en que lo reciba y que se deterioren o menoscaben por el uso legítimo o el paso del tiempo y que de acuerdo a la costumbre son de cargo de la Arrendataria como por ejemplo la rotura de vidrios, llaves, etcétera.
El incumplimiento de esta obligación autorizará al Arrendatario a efectuar personalmente o encargar a terceros las obras requeridas. El costo de tales reparaciones o mantenciones deberá ser restituido por el Arrendador al Arrendatario contra la sola presentación de la boleta, factura o recibo correspondiente, pudiendo éste último imputarlo a las rentas de arrendamiento futuras, a su sólo arbitrio.
La Arrendadora podrá realizar obras de habilitación y/o modificación de la oficina arrendada, con estricto apego a los procedimientos y requisitos señalados por el Reglamento de Copropiedad y por las disposiciones señaladas por el Comité de Administración del Edificio.
Previo a la realización de cualquier obra de habilitación, mantención, mejoramiento y/o conservación, el Arrendatario deberá presentar al Arrendador para su aprobación un proyecto que detalle los trabajos a realizar y la empresa o persona responsable de ejecutarlos.
La responsabilidad por la calidad de las obras o las consecuencias que de las mismas pudieran llegar a producirse o de los perjuicios y daños que su ejecución y materialización provoquen a los demás copropietarios, en sus unidades y/o espacios comunes del Edificio serán exclusivamente del Arrendatario; en consecuencia, la Arrendataria está obligada a hacer las reparaciones pertinentes a su cargo y costo exclusivo, asumiendo los perjuicios que ocasione al Arrendador y a los demás copropietarios y usuarios del Edificio.
El incumplimiento de lo anterior dará derecho al Arrendador para poner término anticipado al contrato, sin perjuicio de las indemnizaciones que procedan.
La Arrendadora no tendrá obligación de hacer mejoras en el inmueble. Pero todas las mejoras e implementaciones introducidas en éste por la Arrendataria quedarán a beneficio de la Arrendadora al término de este contrato, sin cargo alguno para ella.
Sin embargo, la Arrendataria podrá llevarse al término del presente contrato las estanterías y demás instalaciones y muebles que no se encuentren adheridos al inmueble o que puedan separarse sin detrimento de éste, debiendo en todo caso, al llegar la fecha de restitución, entregar el inmueble en las mismas o mejores condiciones que las existentes al momento de la firma del presente contrato. Lo anterior, sin perjuicio de los bienes muebles de propiedad de la Arrendadora, detallados en el Anexo 1, los cuales serán de propiedad de la Arrendadora tanto durante la vigencia del presente contrato como con posterioridad al término del mismo.
Será obligación de la Arrendataria cuidar y mantener el inmueble arrendado en buen estado de aseo y conservación, efectuando a su cargo las reparaciones locativas correspondientes, sin perjuicio de lo cual y para mayor claridad las partes convienen lo siguiente:
Serán de cargo y costo de la Arrendadora las "reparaciones necesarias", esto es, aquéllas que sean indispensables para la subsistencia de los inmuebles arrendados, salvo que estas reparaciones tengan su origen y causa en el hecho o culpa de la Arrendataria, sus dependientes, clientes, proveedores, o en general de terceros ajenos a la Arrendadora, caso en el cual serán de cargo y costo de la Arrendataria.
Serán de cargo y costo de la Arrendataria las "reparaciones locativas", esto es, las que digan relación con, pero no limitado a, desgaste, daños, deterioros y roturas en los inmuebles arrendados y sus instalaciones, sus ventanales y sus cristales, chapas, enchufes, entre otros, cuya causa sea el uso legítimo uso, el hecho o culpa de la Arrendataria, de sus dependientes, clientes, proveedores o de otros terceros ajenos a la Arrendadora.
Solo podrá la Arrendataria hacer "reparaciones útiles" en el inmueble arrendado y sus instalaciones, con la autorización previa y por escrito de la Arrendadora. El costo de estas reparaciones será siempre de cargo de la Arrendataria, sin derecho a compensación o reembolso alguno.
En caso de producirse en el Inmueble un desperfecto cuya reparación sea de cargo de la Arrendadora, según lo expresado precedentemente, la Arrendataria deberá dar aviso inmediato y por escrito a la Arrendadora o a su representante a objeto de que proceda la Arrendadora a ejecutar las reparaciones en cuestión.
Se deja constancia que el Inmueble se encuentran bajo la garantía legal de construcción, en consecuencia, el Arrendatario acepta y declara su conformidad en cuanto a que los desperfectos en la construcción del Edificio serán reparados por la Empresa "Inversiones y Rentas ILC SpA", Rut N° 76.392.693-1 quien realizará las reparaciones, cambios, modificaciones y mantenciones que sean necesarias mientras las garantías se encuentren vigentes, obligándose a dar todas las facilidades para que éstas se realicen.
En este acto, la Arrendadora otorga mandato a la Arrendataria para solicitar directamente a la Empresa "Inversiones y Rentas ILC SpA", los servicios de postventa que requiera.

DÉCIMO SÉPTIMO: Obligación de Restitución.
La Arrendataria se obliga a restituir el Inmueble Arrendado en la fecha de expiración o término de este contrato, cualquiera sea su causa. Se obliga a efectuar dicha restitución mediante la desocupación total del Inmueble, poniéndolo a disposición de la Arrendadora y entregándole las llaves, libre de ocupantes a cualquier título.
Se obliga asimismo a entregar a la Arrendadora en la misma oportunidad los recibos o comprobantes que acrediten que el Inmueble no registra deudas por concepto de suministros de energía eléctrica, agua potable o cualquier otro servicio, patentes, tasas, derechos o multas que puedan gravarlo o afectar a la Arrendadora y de cualquier gasto que se haya producido hasta el último día en que ocupó la propiedad.
Deberá restituir la propiedad en buen estado de conservación habida consideración del desgaste natural por su legítimo uso, sin roturas, y en general cualquier otro daño que se pueda producir por el retiro de bienes por parte del Arrendatario.
El atraso en la restitución del Inmueble obligará al Arrendatario a pagar al Arrendador el monto de las rentas adeudadas hasta la fecha de la restitución, más una multa que las partes dan el carácter de avaluación convencional y anticipada de perjuicios equivalente a toda suma de dinero entregada por cualquier concepto al Arrendador, más las garantías que haya otorgado, más la totalidad de las rentas de arrendamiento faltantes por el plazo que le reste al contrato de arrendamiento, hasta el final del plazo de arriendo pactado originalmente o de la renovación que se encontrare vigente, según corresponda.
Asimismo, la Arrendataria deberá pagar a título de cláusula penal moratoria avaluada anticipadamente y de común acuerdo entre las Partes, en una suma equivalente a un cinco por ciento de la última renta de arrendamiento, por cada día o fracción de día de retraso, sin perjuicio de su obligación de pagar la renta de arrendamiento hasta la fecha efectiva de restitución total del Inmueble Arrendado.
Además, el Arrendador podrá descerrajar, ingresar, desocupar, desalojar, usar y gozar de las cosas arrendadas de forma inmediata sin notificación, declaración, o autorización de ninguna naturaleza. Lo anterior es expresamente aceptado por la Arrendataria y concede expresamente a la Arrendadora el derecho legal de retención sobre los bienes que se encuentren dentro del inmueble arrendado a esa fecha y asume la pérdida, deterioro, desgaste, daño y perjuicio que puedan sufrir los mismos.
Con todo, se faculta y se otorga mandato irrevocable al Arrendador para interrumpir el suministro de energía eléctrica y agua potable del inmueble arrendado. La utilización de alguno de los procedimientos indicados no implicará la renuncia al ejercicio de otros derechos, acciones o recursos que tuviere el Arrendador para obtener la restitución del inmueble arrendado.
De la misma forma, si el Arrendatario tardaré más de 4 días contados desde la fecha en que debió restituir el inmueble, en desocuparlo, los bienes no retirados del inmueble se entenderán abandonados, es decir, que no pertenecen a nadie, para todos los efectos legales y desde esa fecha serán de propiedad y exclusivo dominio del Arrendador. De la misma forma, el Arrendatario tendrá prohibido ingresar al inmueble a contar de esa fecha.
La Arrendataria no tendrá derecho a cobrar a la Arrendadora, al término del contrato ni en ningún otro momento, suma alguna de dinero por concepto de derecho de llaves u otro de similar naturaleza, ni podrá condicionar la restitución del inmueble arrendado al pago previo de tales derechos.
Se deja expresa constancia que la permanencia de la Arrendataria en el Inmueble Arrendado con posterioridad al vencimiento del plazo del Contrato o de la prórroga en curso, no significará ni le dará derecho, en ningún caso, a la renovación del mismo, ni aún si pagare a la Arrendadora una suma de dinero por tal permanencia.

DÉCIMO OCTAVO: Garantía de Arrendamiento.
La Arrendataria entrega en este acto a la arrendadora, a título de garantía, la suma de {{MONTO_RENTA_UF}} Unidades de Fomento, sin IVA, a fin de caucionar todas y cada una de las obligaciones que para ella emanan del Contrato y, en especial, sin que la enumeración sea limitativa:
/A/ La de conservar y mantener debidamente el Inmueble Arrendado y su oportuna restitución;
/B/ El pago de los perjuicios de cualquier especie que ocasionare al Inmueble Arrendado; y
/C/ El pago oportuno de los gastos comunes y de los consumos domiciliarios y demás análogos que le corresponden de acuerdo a la ley o al Contrato.
La Arrendataria no podrá en caso alguno aplicar o compensar todo o parte de la garantía con la última renta de arrendamiento o con alguna renta adeudada.
Esta garantía deberá restituirse a la Arrendataria dentro de los sesenta días siguientes al término de este contrato, si procede y en ningún caso podrá ser imputada al pago de rentas mensuales de arrendamiento, salvo con consentimiento expreso del Arrendador.
La Arrendadora queda desde ya autorizada para descontar de la cantidad mencionada el valor de los deterioros y perjuicios de cargo de la Arrendataria, como también, el valor de las cuentas pendientes de gastos comunes, luz, agua, multas, perjuicios, etcétera.

DÉCIMO NOVENO: Siniestros.
La Arrendadora no responderá de modo alguno por los robos, hurtos, daños a la propiedad y otros que puedan ocurrir en el Inmueble Arrendado como tampoco por los perjuicios que pudieren generar a la Arrendataria posibles incendios, inundaciones, filtraciones, explosiones, roturas de cañerías, efectos de humedad, calor, acción de roedores u otros estragos cuyas consecuencias afecten al Inmueble o a bienes o valores de propiedad de la Arrendataria o de terceros.
Tampoco responderá en caso alguno del caso fortuito o fuerza mayor.
La Arrendataria deberá soportar los perjuicios que se deriven del caso fortuito o fuerza mayor y le corresponderá contar con la póliza de seguros que la ampare.

VIGÉSIMO. Integridad del Contrato.
El presente contrato constituye el único y total acuerdo entre las partes con relación al objeto del mismo por lo que ambas partes acuerdan dejar sin efectos legales cualquier otro acuerdo, verbal o escrito, que hayan celebrado con anterioridad a esta fecha.

VIGÉSIMO PRIMERO: Cesión.
En caso de que el Inmueble sea posteriormente vendido a un tercero, el Arrendador se obliga a ceder el presente contrato a dicho tercero que compre el Inmueble.
La Arrendataria autoriza expresamente al Arrendador para ceder el presente contrato, consintiendo anticipadamente en la cesión, bastando solamente la notificación de la cesión del contrato al Arrendatario en la forma que establece la ley.
Asimismo, en caso de que el Inmueble sea adquirido por un Banco, Compañía de Seguro o Institución Financiera, y sea entregado en leasing al Arrendador, éste pasará a tener la calidad de Sub-Arrendador y el Arrendatario la calidad de Sub-Arrendatario.

VIGÉSIMO SEGUNDO: Gastos Notaría.
Todos los gastos notariales que se deriven del presente contrato serán de cargo del Arrendatario.

VIGÉSIMO TERCERO: Seguridad.
Se deja expresamente establecido que el Edificio no ofrece ni presta el servicio de seguridad respecto de los bienes propios de cada usuario, ni de las personas que ingresan al Inmueble.
De la misma forma, el Arrendador no se hace responsable por los robos o hurtos que ocurran en las unidades arrendadas o en los espacios comunes ni del daño o perjuicio que puedan sufrir las personas o bienes de éstas.
Como consecuencia de lo anterior, el único y exclusivo responsable del cuidado y protección de sus bienes y de las personas que ingresen a su unidad es el Arrendatario, quien deberá contratar por su cuenta y a su cargo los seguros pertinentes.

VIGÉSIMO CUARTO: Domicilio y jurisdicción.
Para todos los efectos del presente contrato y en especial, los judiciales y legales, las Partes fijan su domicilio en la comuna y ciudad de Santiago y se someten a la jurisdicción y competencia de sus Tribunales Ordinarios de Justicia.

VIGÉSIMO QUINTO: Avisos.
Cualquier aviso, notificación, solicitud, reclamo o comunicación que se efectúe entre las partes con ocasión del presente contrato deberá ser efectuada por escrito y se considerará recibida por el destinatario al día hábil siguiente de su envío por correo electrónico o al tercer día de su envío por correo normal, correo certificado o inmediatamente si es en persona.
Toda correspondencia y notificación deberá dirigirse a las siguientes direcciones, salvo que alguna de las partes comunicare por carta certificada dirigida a la otra el cambio de domicilio; con todo, se considerarán válidas todas las comunicaciones y notificaciones efectuadas durante los quince días anteriores a la fecha de modificación del nuevo domicilio.
Respecto a la Arrendadora:
Arrendadora: 		: INVERSIONES CIENFUEGOS 151 SpA
Atención:		: Francisco Correa
Dirección:		: Américo Vespucio Norte 1090, oficina 403
Teléfono:		: +56 939177493
Correo electrónico:     : fcorrea@ibrick.cl

Respecto al arrendador
Arrendataria
Atención		: {{REPRESENTANTE_NOMBRE}}
Dirección		: {{ARRENDATARIO_DOMICILIO}}
Teléfono		: {{ARRENDATARIO_TELEFONO}}
Correo electrónico	: {{ARRENDATARIO_EMAIL}}

PERSONERÍAS.
La personería de los representantes de Inversiones Cienfuegos 151 SpA consta de escritura pública de fecha 14 de octubre de 2020, otorgada en la Notaría de Santiago de don Humberto Quezada Moreno.
La personería señalada no se inserta por ser conocida de las Partes y del Notario, y a expresa petición de las primeras.
EL PRESENTE CONTRATO DE ARRENDAMIENTO SE SUSCRIBE EN DOS EJEMPLARES DE IDÉNTICO TENOR Y FECHA, QUEDANDO UNO EN PODER DE CADA UNA DE LAS PARTES.

________________________
Boris Candia Álvarez
pp. Inversiones Cienfuegos 151 SpA

__________________________
José Ignacio Bezanilla Zañartu
pp. Inversiones Cienfuegos 151 SpA

___________________________
{{REPRESENTANTE_NOMBRE}}
pp. {{ARRENDATARIO_NOMBRE}}
RUT: {{ARRENDATARIO_RUT}}
`;


/**
 * Construye el prompt completo que se enviará a la API de Google Gemini.
 * @param {Object} data - Objeto con los datos del formulario o CSV
 * @returns {string} - El prompt completo para Gemini
 */
function getPromptForGemini(data) {
   return `Eres un abogado chileno experto en redacción de contratos. Tu tarea es procesar el siguiente contrato de arriendo y generar la versión final lista para firmar.

INSTRUCCIONES ESTRICTAS:
1. Usa la PLANTILLA BASE que te proporcionaré como estructura exacta. NO inventes cláusulas nuevas, NO resumas y NO elimines el texto legal existente.
2. Reemplaza TODOS los placeholders ({{...}}) con los DATOS DEL CONTRATO provistos abajo.
3. AJUSTA LA GRAMÁTICA AUTOMÁTICAMENTE (Esta es tu tarea principal):
   - Si en el campo "Oficina(s)" viene un solo número (ej. "803"), debes redactar: "la oficina número 803 ubicada en el..." y ajustar "La oficina N°803 tiene una superficie...".
   - Si en el campo "Oficina(s)" vienen varios números (ej. "803 y 802"), debes redactar en plural: "las oficinas número 803 y 802 ubicadas en el..." y "Las oficinas N°803 y 802 tienen una superficie...".
   - Haz lo mismo con los estacionamientos (singular o plural según corresponda).
   - Ajusta artículos (el/la/los/las), verbos y pronombres para que todo el documento tenga coherencia gramatical absoluta.
4. Para el Representante Legal: Si se proporciona nombre, redacta la sección como ", representada por don/doña [Nombre], cédula de identidad número [RUT_Representante]". Si no hay representante, omite esa frase sutilmente.
5. Devuelve SOLAMENTE el texto del contrato final. No incluyas comentarios, explicaciones, ni formato markdown como \`\`\` text.

DATOS DEL CONTRATO:
- Fecha de Contrato: ${data.fecha_contrato || '01 Septiembre de 2025'}
- Arrendatario (Empresa/Persona): ${data.arrendatario_nombre || 'No especificado'}
- RUT Arrendatario: ${data.arrendatario_rut || 'No especificado'}
- Domicilio Arrendatario: ${data.arrendatario_domicilio || 'No especificado'}
- Nombre Representante: ${data.representante_nombre || ''}
- RUT Representante: ${data.representante_rut || ''}
- Oficina(s) (ej. "803" o "803 y 802"): ${data.oficinas || 'No especificado'}
- Piso de Oficina(s) (ej. "octavo piso"): ${data.piso || 'No especificado'}
- Estacionamiento(s) (ej. "195" o "195 y 196"): ${data.estacionamientos || 'No especificado'}
- Superficie (ej. "32,00 m2" o "32,00 y 20,81 metros cuadrados"): ${data.superficie || 'No especificado'}
- Plazo en meses: ${data.plazo_meses || '12'}
- Días de aviso término: ${data.dias_aviso || '60'}
- Monto Renta UF: ${data.monto_renta_uf || '28'}
- Porcentaje Multa Atraso: ${data.porcentaje_multa_atraso || '5'}
- Teléfono Arrendatario: ${data.arrendatario_telefono || 'No especificado'}
- Email Arrendatario: ${data.arrendatario_email || 'No especificado'}

PLANTILLA BASE:
${CONTRATO_TEMPLATE}

Genera el contrato final ahora:`;
}