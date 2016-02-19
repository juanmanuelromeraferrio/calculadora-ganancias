$(document).ready(function() {
	
	$('#calcular').on('click', function() {
		calcular();
	})

	$(document).keypress(function(e) {
	  if (e.keyCode == 13) {
		e.preventDefault();
		calcular();
	  }
	});

});

function calcular() {
	
	var sueldoBruto = $('#sueldoBruto').val();
	var conyuge = $("input[name='conyuge']:checked").val();
	
	var familiaresComponent = document.getElementById("familiares");
	var cantFamiliares = familiaresComponent.options[familiaresComponent.selectedIndex].value;
	
	var hijosComponent = document.getElementById("hijos");
	var cantHijos = hijosComponent.options[hijosComponent.selectedIndex].value;
	
	
	var sueldoNeto = sueldoBruto * 0.83;
	var sueldoNetoAnual = sueldoNeto * 13;
	
	var MNI_anual = 42318+203126+39778*cantFamiliares+19889*cantHijos
	var MNI_mensual = MNI_anual / 13;
	
	var MontoImponibleAnual =  0;
	if(MNI_anual < sueldoNetoAnual)
	{
		MontoImponibleAnual = sueldoNetoAnual - MNI_anual;
	}
	
	var MontoImponibleMensual = MontoImponibleAnual / 13;
	
	var topesEscalas = [10000, 20000, 30000, 60000, 90000, 120000];
	var porcentajesEscalas = [0.09, 0.14, 0.19, 0.23, 0.27, 0.31, 0.35];
	var fijosEscalas = [900, 1400, 1900, 6900, 8100, 9300];
	var totalEscalas = [0, 0, 0, 0, 0, 0,0];

	if(MontoImponibleAnual < topesEscalas[0])
	{
		totalEscalas[0] = MontoImponibleAnual *  porcentajesEscalas[0];
	}
	else
	{
		totalEscalas[0] = fijosEscalas[0];
		if(MontoImponibleAnual < topesEscalas[1])
		{
			totalEscalas[1] = (MontoImponibleAnual - topesEscalas[0]) * porcentajesEscalas[1];
		}
		else
		{
			totalEscalas[1] = fijosEscalas[1];
			if(MontoImponibleAnual < topesEscalas[2])
			{
				totalEscalas[2] = (MontoImponibleAnual - topesEscalas[1]) * porcentajesEscalas[2];
			}
			else
			{
				totalEscalas[2] = fijosEscalas[2];
				if(MontoImponibleAnual < topesEscalas[3])
				{
					totalEscalas[3] = (MontoImponibleAnual - topesEscalas[2]) * porcentajesEscalas[3];
				}
				else
				{
					totalEscalas[3] = fijosEscalas[3];
					if(MontoImponibleAnual < topesEscalas[4])
					{
						totalEscalas[4] = (MontoImponibleAnual - topesEscalas[3]) * porcentajesEscalas[4];
					}
					else
					{
						totalEscalas[4] = fijosEscalas[4];
						if(MontoImponibleAnual < topesEscalas[5])
						{
							totalEscalas[5] = (MontoImponibleAnual - topesEscalas[4]) * porcentajesEscalas[5];
						}
						else
						{
							totalEscalas[5] = fijosEscalas[5];
							totalEscalas[6] = (MontoImponibleAnual - topesEscalas[5]) * porcentajesEscalas[6];
						}
					}
				}
			}
		}
	}

	var impuestoAnual = 0;
	
	for (var i=0; i<totalEscalas.length; i++) 
	{
	  impuestoAnual =  impuestoAnual + totalEscalas[i];
	}

	$("#impuestoAnual").text("$" + Math.ceil(impuestoAnual) + ".00");
	

	var impuestoMensual = impuestoAnual / 13;
	$("#impuestoMensual").text("$" + Math.ceil(impuestoMensual) + ".00");
	var alicuota = (impuestoMensual / sueldoNeto)*100;
	
	$("#alicuota").text(alicuota.toFixed(2) + "%");
	
	var sueldoEnMano = sueldoNeto - impuestoMensual;
	$("#sueldoEnMano").text("$" + Math.ceil(sueldoEnMano) + ".00");
	
	
}