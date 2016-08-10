"use strict";
var react_apollo_1 = require('react-apollo');
var react_redux_1 = require('react-redux');
var config_1 = require('./config');
function connectWithContext(props) {
    var modified = {};
    var needsApollo = false;
    if (props.mapStateToProps) {
        modified['mapStateToProps'] = function (state, ownProps) { return props.mapStateToProps(config_1.default.context, state, ownProps); };
    }
    if (props.mapDispatchToProps) {
        modified['mapDispatchToProps'] = function (state, ownProps) { return props.mapDispatchToProps(config_1.default.context, state, ownProps); };
    }
    if (props.mergeProps) {
        modified['mergeProps'] = function (state, ownProps) { return props.mergeProps(config_1.default.context, state, ownProps); };
    }
    if (props.mapQueriesToProps) {
        needsApollo = true;
        modified['mapQueriesToProps'] = function (state, ownProps) { return props.mapQueriesToProps(config_1.default.context, state, ownProps); };
    }
    if (props.mapMutationsToProps) {
        needsApollo = true;
        modified['mapMutationsToProps'] = function (state, ownProps) { return props.mapMutationsToProps(config_1.default.context, state, ownProps); };
    }
    return needsApollo ?
        react_apollo_1.connect(modified) :
        react_redux_1.connect(modified['mapStateToProps'], modified['mapDispatchToProps'], modified['mergeProps'], props.options);
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = connectWithContext;
