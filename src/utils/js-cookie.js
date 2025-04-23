import { useCookies } from 'vue3-cookies';

const TokenKey = 'access_token';

export function getToken() {
    const { cookies } = useCookies();
    return cookies.get(TokenKey);
}

export function setToken(token) {
    const { cookies } = useCookies();
    cookies.set(TokenKey, token, {
        httpOnly: true, // Bảo vệ khỏi XSS
        secure: true,   // Chỉ hoạt động trên HTTPS
        sameSite: 'Strict', // Ngăn CSRF
        expires: 7      // Thời gian sống
    });
}

export function removeToken() {
    const { cookies } = useCookies();
    return cookies.remove(TokenKey);
}
