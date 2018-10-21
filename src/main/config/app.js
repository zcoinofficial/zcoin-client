export default {
    protocolIdentifier: 'zcoin',
    core: {
        autoRestart: true,
        stopOnQuit: process.env.NODE_ENV === 'production',
        heartbeatIntervalInSeconds: 10
    },
    folders: {
        encryption: {
            root: 'certificates',
            client: 'client',
            server: 'server',
            fileName: 'keys.json'
        }
    }
}
