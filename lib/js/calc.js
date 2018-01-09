var TOPES_ESCALAS = [25800, 51600, 77400, 103200, 154800, 206400, 309600, 412800, 99999999],
    PORCENTAJES_ESCALES = [.05, .09, .12, .15, .19, .23, .27, .31, .35],
    MINIMO_NO_IMPONIBLE = 66917.91,
    ADICIONAL_4TA_CATEGORIA = 321205.968,
    CONYUGE = 62385.2,
    HIJO = 31461.09,
    TOPE_APORTES = 13926.16,
    TOPE_JUBILADO = 407592,
    TOPE_ALQUILER = 51967,
    TOPE_HIPOTECARIO = 20000,
    PORCENTAJE_ALQUILER = 0.4,
    PORCENTAJE_PATAGONICO = 1.22,
    APORTES_JUBILADOS = .06,
    APORTES_NO_JUBILADOS = 0.17;

function calcular() {
    //Input Data
    var sueldoBruto = getValue('sueldoBruto');
    var alquiler = getValue('alquiler');
    var hipotecario = getValue('hipotecario');
    var elementHijos = document.getElementById("hijos");
    var hijos = elementHijos.options[elementHijos.selectedIndex].value;

    //Checkboxs
    var isConyuge = isSelected('conyuge');
    var isJubilado = isSelected('jubilado');
    var isPatagonico = isSelected('patagonico');

    //Values
    var deduccionAlquiler = getAnnualAmount(alquiler) * PORCENTAJE_ALQUILER;
    if (deduccionAlquiler > TOPE_ALQUILER) {
        deduccionAlquiler = TOPE_ALQUILER
    }

    var deduccionHipotecario = getAnnualAmount(hipotecario);
    if (deduccionHipotecario > TOPE_HIPOTECARIO) {
        deduccionHipotecario = TOPE_HIPOTECARIO
    }

    //Ingreso Anual
    var aportes = getAportes(sueldoBruto, +isJubilado);
    var sueldoNeto = sueldoBruto - aportes;
    var extras = sueldoNeto; //Aguinaldo + Bonos
    var ingresoAnual = getAnnualAmount(sueldoNeto) + extras;

    //Monto Aplicable a Ganancias
    var mni = MINIMO_NO_IMPONIBLE + ADICIONAL_4TA_CATEGORIA;
    if (+isPatagonico) {
        mni = mni * PORCENTAJE_PATAGONICO;
    }

    var mniTotal = mni + CONYUGE * isConyuge + HIJO * hijos + deduccionAlquiler + deduccionHipotecario;
    if (+isJubilado) {
        mniTotal = TOPE_JUBILADO + deduccionAlquiler + deduccionHipotecario;
    }

    var montoImponibleAplicable = 0;
    if (mniTotal < ingresoAnual) {
        montoImponibleAplicable = ingresoAnual - mniTotal;
    }

    //Impuesto
    var result = calcularImpuesto(montoImponibleAplicable);

    //Show Results
    var impuestoAnual = result.value.toFixed(2);
    $("#impuestoAnual").text("$" + impuestoAnual);
    var impuestoMensual = (impuestoAnual / 12).toFixed(2);
    $("#impuestoMensual").text("$" + impuestoMensual);
    var alicuota = impuestoMensual / sueldoBruto * 100;
    $("#alicuota").text(alicuota.toFixed(2) + "%");
    var alicuotaMarginal = 0 == alicuota ? 0 : 100 * PORCENTAJES_ESCALES[result.escala];
    $("#alicuotaMarginal").text(alicuotaMarginal.toFixed(2) + "%");
    var sueldoEnMano = sueldoNeto - impuestoMensual;
    $("#sueldoEnMano").text("$" + Math.round(sueldoEnMano) + ".00")
}

function calcularImpuesto(monto) {
    var i = 0;
    var result = {};
    var value = 0;

    while (monto > TOPES_ESCALAS[i]) {
        var diff = i == 0 ? TOPES_ESCALAS[i] : TOPES_ESCALAS[i] - TOPES_ESCALAS[i - 1];
        value += diff * PORCENTAJES_ESCALES[i];
        i++;
    }

    diff = i == 0 ? monto : monto - TOPES_ESCALAS[i - 1];
    value += diff * PORCENTAJES_ESCALES[i];
    result.value = value;
    result.escala = i;

    return result;
}

function getAportes(sueldoMensual, isJubilado) {
    var porcentajeAporte = isJubilado ? APORTES_JUBILADOS : APORTES_NO_JUBILADOS;
    var aportes = porcentajeAporte * sueldoMensual;
    if (aportes > TOPE_APORTES) {
        aportes = TOPE_APORTES;
    }

    return aportes;
}


function isSelected(key) {
    return $("input[name='" + key + "']:checked").val()
}

function getValue(key) {
    return $("#" + key).val()
}

function getAnnualAmount(value) {
    return value * 12;
}

$(document).ready(function() {
    $("#calcular").on("click", function() {
        calcular()
    }), $(document).keypress(function(a) {
        13 == a.keyCode && (a.preventDefault(), calcular())
    }), $("input[name='jubilado']").click(function() {
        $("input[name='conyuge']").attr({
            disabled: 1 == $(this).val()
        }), $("input[name='patagonico']").attr({
            disabled: 1 == $(this).val()
        })
    })
});