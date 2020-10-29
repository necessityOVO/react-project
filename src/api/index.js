import instance from './instance'

//请求登陆
export const reqLogin = (username, password) => instance.post("/login", {username, password});

//验证token 
export const reqVerifyToken = () => instance.post("/check_token")

// 高德天气接口
// export const reqWeather = () => instance.post("")
