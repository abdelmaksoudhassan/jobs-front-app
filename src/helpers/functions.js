export function setSession(token,role){
    sessionStorage.setItem('idToken',token)
    const expiresIn = new Date().getTime() + 24*60*60*1000  //expired after 24 houres
    sessionStorage.setItem('expiresIn',expiresIn)
    sessionStorage.setItem('role',role)
}

export function getSession(){
    const expiresIn = +sessionStorage.getItem('expiresIn')
    if(new Date().getTime() > expiresIn){
        sessionStorage.removeItem('expiresIn')
        sessionStorage.removeItem('idToken')
        return ''
    }
    const token = sessionStorage.getItem('idToken')
    const role = sessionStorage.getItem('role')
    const session = {token,role}
    return session
}

export function clearToken(){
    sessionStorage.removeItem('expiresIn')
    sessionStorage.removeItem('idToken')
    sessionStorage.removeItem('role')
}

export function err_Msg(){
    return 'unexpected error occured !! open console for more info'
}