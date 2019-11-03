var CalcGanancias = window.calcGanancias;
const calcGanancias = new CalcGanancias();

function calc() {
  var options = {
    sueldoBruto: getNumberValue("#sueldoBruto", 0),
    alquiler: getNumberValue("#alquiler", 0),
    creditoHipotecario: getNumberValue("#hipotecario", 0),
    cantHijos: Number(document.getElementById("hijos").options[
      document.getElementById("hijos").selectedIndex
    ].value),
    isConyuje: getCheckboxValue("conyuge"),
    isJubilado: getCheckboxValue("jubilado"),
    isPatagonico: getCheckboxValue("patagonico")
  };

  var result = calcGanancias.calculate(options);

  $("#impuestoAnual").text("$" + result.anualTax);
  $("#impuestoMensual").text("$" + result.monthlyTax);
  $("#alicuota").text(result.taxRate);
  $("#alicuotaMarginal").text(result.marginalTaxRate);
  $("#sueldoEnMano").text("$" + result.netBaseSalary);
  $("html, body").animate(
    {
      scrollTop:
        $(document).height() - $(document.getElementById("result")).height()
    },
    50
  );
}

function getNumberValue(label, defaultValue) {
  let value = $(label).val();
  return value != "" ? Number(value) : defaultValue;
}

function getCheckboxValue(label) {
  let value = $("input[name=" + label + "]:checked").val();
  return value === "0" ? false : true;
}

$(document).ready(function() {
  $("#calcular").on("click", function() {
    calc();
  }),
    $(document).keypress(function(a) {
      13 == a.keyCode && (a.preventDefault(), calc());
    }),
    $("input[name='jubilado']").click(function() {
      $("input[name='conyuge']").attr({
        disabled: 1 == $(this).val()
      }),
        $("input[name='patagonico']").attr({
          disabled: 1 == $(this).val()
        });
    });
});
