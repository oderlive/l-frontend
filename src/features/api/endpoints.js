export const BASE_URL = 'http://195.43.142.64:8080/logos-lms/api/v1';

export const ENDPOINTS = {
    LOGOUT: `${BASE_URL}/auth/logout`,
    ACTIVATE_ACCOUNT: `${BASE_URL}/auth/activate-account`,
    DISABLE_TFA: `${BASE_URL}/auth/disable-tfa`,
    ENABLE_TFA: `${BASE_URL}/auth/enable-tfa`,
    VERIFY_TFA_CODE: `${BASE_URL}/auth/verify-tfa-code`, // верификация 2FA кода
    SEND_MAIL_FOR_TFA_SECRET_RESET: `${BASE_URL}/auth/send-mail-for-tfa-secret-reset`, // отправка письма для сброса 2FA secret
    SEND_MAIL_FOR_PASSWORD_RESET: `${BASE_URL}/auth/send-mail-for-password-reset`, // отправка письма для сброса пароля
    RESET_TFA: `${BASE_URL}/auth/reset-tfa`, // сброс 2FA secret
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`, // сброс пароля
    REFRESH_ACCESS_TOKEN: `${BASE_URL}/auth/refresh-access-token`, // обновление токена доступа
    MAKE_AUTH: `${BASE_URL}/auth/make-auth`, // аутентификация пользователя
    INSTITUTIONS: `${BASE_URL}/institutions`, // добавление учебного заведения
    GROUP: `${BASE_URL}/groups`,
    USERS: `${BASE_URL}/users`,
    COURSES: `${BASE_URL}/courses`,
    TASKS: `${BASE_URL}/tasks`,
    COMMENTS: `${BASE_URL}/comments`,
    SOLUTIONS: `${BASE_URL}/solutions`,
};