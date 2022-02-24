import React, { useState, useEffect } from "react";
import service from 'service'

export default function (props) {
    const [loading, setLoading] = useState(true);
    function init() {
        let urlParams = new URLSearchParams(window.location.search);
        let serviceURL = urlParams.get('serviceURL');
        service.sso.doLogin({ serviceURL }).then(function (response) {
            let { data } = response;
            data && (window.location.href = data)
            setLoading(false)
        }).catch(function (error) {
        });
    }
    useEffect(() => {
        init()
    }, [])
    if (loading) {
        return 'loading...'
    }
    return props.children;
}