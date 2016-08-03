"use strict";
var react_apollo_1 = require('react-apollo');
var config_1 = require('./config');
function connectWithMantra(props) {
    var modified = {};
    if (props.mapStateToProps) {
        modified['mapStateToProps'] = function (state, ownProps) { return props.mapStateToProps(config_1.default.context, state, ownProps); };
    }
    if (props.mapDispatchToProps) {
        modified['mapDispatchToProps'] = function (state, ownProps) { return props.mapDispatchToProps(config_1.default.context, state, ownProps); };
    }
    if (props.mapQueriesToProps) {
        modified['mapQueriesToProps'] = function (state, ownProps) { return props.mapQueriesToProps(config_1.default.context, state, ownProps); };
    }
    if (props.mapMutationsToProps) {
        modified['mapMutationsToProps'] = function (state, ownProps) { return props.mapMutationsToProps(config_1.default.context, state, ownProps); };
    }
    return react_apollo_1.connect(modified);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectWithMantra;
