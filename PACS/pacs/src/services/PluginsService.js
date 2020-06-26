const PPLUGIN_LIST_URL = '/api/plugins';

export default class PluginsService {

    static onPlugin1 (instanceid,pluginid,f){
        fetch(
            `/api/instances/${instanceid}/process/by_plugin/${pluginid}/image`,{
                method:"POST",
                headers:{
                    'Content-Type':'image/jpeg;charset=base64;'
                },
                mode: 'no-cors',
            }
        ).then(function (response){     
            console.log("response",response)      
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            console.log(response.status);
            const error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            throw error;
        }).then(response => {      
            const ans=response.json();
            console.log("ans",ans)    
            return ans;
        }).then(f);
    }

    static findPlugins(f) {
        return fetch(
            PPLUGIN_LIST_URL
        ).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            console.log(response.status);
            const error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            throw error;
        }).then(response => {
            return response.json();
        }).then(f);
    }

    static findPluginById(f, id) {
        fetch(
            `${PPLUGIN_LIST_URL}/${id}`
        ).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }
            console.log(response.status);
            const error = new Error(`HTTP Error ${response.statusText}`);
            error.status = response.statusText;
            error.response = response;
            throw error;
        }).then(response => {
            return response.json();
        }).then(f);
    }
}