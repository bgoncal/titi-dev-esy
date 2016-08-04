'use strict';

angular
    .module('titi')
    .factory('currentSearch', [currentSearch]);

function currentSearch() {

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
