'use strict';

angular
    .module('titi')
    .factory('currentRate', [currentRate]);

function currentRate() {

    var savedData = {}

    function set(data) {
        savedData = data;
    }

    function get() {
        return savedData;
    }

    return {
        set: set,
        get: get
    }

}
