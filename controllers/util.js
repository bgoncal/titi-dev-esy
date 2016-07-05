angular
	.module('titi')
  .directive('matchFields', matchFields);

function matchFields () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      var fieldToCompare = '#' + attrs.matchFields;
      elem.add(fieldToCompare).on('keyup', function () {
        scope.$apply(function () {
          var v = elem.val()===$(fieldToCompare).val();
          ctrl.$setValidity('matchFields', v);
        });
      });
    }
  };
}
