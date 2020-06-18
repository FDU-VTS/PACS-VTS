import MenuContainer from "../components/common/MenuContainer";
import React, {Component} from "react";
import {Translate} from 'react-localize-redux';
import PluginsService from "../services/PluginsService";
import {Button, Divider, Dropdown, Form, Header, Message, Segment, Select} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import PluginItem from "../components/pluginsPage/PluginItem";
import * as axios from 'axios';

const PLUGINS_REPO_META_URL = "https://raw.githubusercontent.com/reactmed/neurdicom-plugins/master/REPO_META.json";

class PluginsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            plugins: []
        };
        this.setState = this.setState.bind(this);
    }

    componentWillMount = () => {
        PluginsService.findPlugins(installedPlugins => {
            installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                pluginsMap[plugin.name] = plugin;
                return pluginsMap;
            }, {});
            axios.get(PLUGINS_REPO_META_URL).then(allPlugins => {
                allPlugins = allPlugins.data.plugins.reduce((pluginsMap, plugin) => {
                    pluginsMap[plugin.name] = plugin.meta;
                    return pluginsMap;
                }, {});
                this.setState({plugins: {...allPlugins, ...installedPlugins}});
            });
        });
    };

    onDeletePlugin = (plugin) => {
        axios.delete(
            `/api/plugins/${plugin['id']}`
        ).then((response) => {
            PluginsService.findPlugins(installedPlugins => {
                installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                    pluginsMap[plugin.name] = plugin;
                    return pluginsMap;
                }, {});
                axios.get(PLUGINS_REPO_META_URL).then(allPlugins => {
                    allPlugins = allPlugins.data.plugins.reduce((pluginsMap, plugin) => {
                        pluginsMap[plugin.name] = plugin.meta;
                        return pluginsMap;
                    }, {});
                    this.setState({plugins: {...allPlugins, ...installedPlugins}});
                });
            });
        }).catch((err) => {
            alert(err.response.data['message']);
            this.setState({});
        })
    };

    onInstallPlugin = (plugin) => {
        axios.post(
            `/api/plugins/${plugin['name']}/install`
        ).then((response) => {
            PluginsService.findPlugins(installedPlugins => {
                installedPlugins = installedPlugins.reduce((pluginsMap, plugin) => {
                    pluginsMap[plugin.name] = plugin;
                    return pluginsMap;
                }, {});
                axios.get(PLUGINS_REPO_META_URL).then(allPlugins => {
                    allPlugins = allPlugins.data.plugins.reduce((pluginsMap, plugin) => {
                        pluginsMap[plugin.name] = plugin.meta;
                        return pluginsMap;
                    }, {});
                    this.setState({plugins: {...allPlugins, ...installedPlugins}});
                });
            });
        }).catch((err) => {
            alert(err.response.data['message']);
            this.setState({});
        })
    };

    render() {
        
    }
}

export default PluginsPage;