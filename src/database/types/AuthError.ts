export enum AuthError {
    UNKNOWN = "Ocorreu um erro desconhecido.",
    EMAIL_ALREADY_IN_USE = "Este e-mail já está em uso. Tente outro.",
    INVALID_EMAIL = "O e-mail fornecido não é válido. Verifique e tente novamente.",
    WEAK_PASSWORD = "A senha fornecida é muito fraca. Ela deve ter pelo menos 6 caracteres.",
    MISSING_EMAIL = "O e-mail é obrigatório. Por favor, insira um e-mail válido.",
    USER_NOT_FOUND = "Nenhum usuário encontrado com esse e-mail. Verifique e tente novamente.",
    WRONG_PASSWORD = "A senha fornecida está incorreta. Tente novamente.",
    NETWORK_REQUEST_FAILED = "Falha na rede. Verifique sua conexão e tente novamente.",
    OPERATION_NOT_ALLOWED = "Essa operação não é permitida. Entre em contato com o administrador.",
    TOO_MANY_REQUESTS = "Você fez muitas tentativas. Tente novamente mais tarde.",
    INVALID_CREDENTIAL = "As credenciais fornecidas são inválidas. Verifique e tente novamente.",
    EXPIRED_ACTION_CODE = "O código de ação expirou. Solicite um novo.",
    INVALID_ACTION_CODE = "O código de ação fornecido é inválido. Verifique e tente novamente.",
    EMAIL_NOT_FOUND = "O e-mail fornecido não foi encontrado. Verifique e tente novamente.",
    ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL = "Já existe uma conta associada a esse e-mail com credenciais diferentes.",
    CREDENTIAL_ALREADY_IN_USE = "A credencial fornecida já está em uso. Tente outro.",
    ADMIN_ONLY_OPERATION = "Somente administradores podem realizar esta operação.",
    REQUIRES_RECENT_LOGIN = "Para realizar esta ação, é necessário fazer login novamente.",
}

export function mapAuthError(errorCode: string): AuthError {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return AuthError.EMAIL_ALREADY_IN_USE;
        case 'auth/invalid-email':
            return AuthError.INVALID_EMAIL;
        case 'auth/weak-password':
            return AuthError.WEAK_PASSWORD;
        case 'auth/missing-email':
            return AuthError.MISSING_EMAIL;
        case 'auth/user-not-found':
            return AuthError.USER_NOT_FOUND;
        case 'auth/wrong-password':
            return AuthError.WRONG_PASSWORD;
        case 'auth/network-request-failed':
            return AuthError.NETWORK_REQUEST_FAILED;
        case 'auth/operation-not-allowed':
            return AuthError.OPERATION_NOT_ALLOWED;
        case 'auth/too-many-requests':
            return AuthError.TOO_MANY_REQUESTS;
        case 'auth/invalid-credential':
            return AuthError.INVALID_CREDENTIAL;
        case 'auth/expired-action-code':
            return AuthError.EXPIRED_ACTION_CODE;
        case 'auth/invalid-action-code':
            return AuthError.INVALID_ACTION_CODE;
        case 'auth/email-not-found':
            return AuthError.EMAIL_NOT_FOUND;
        case 'auth/account-exists-with-different-credential':
            return AuthError.ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL;
        case 'auth/credential-already-in-use':
            return AuthError.CREDENTIAL_ALREADY_IN_USE;
        case 'auth/admin-only-operation':
            return AuthError.ADMIN_ONLY_OPERATION;
        case 'auth/requires-recent-login':
            return AuthError.REQUIRES_RECENT_LOGIN;
        default:
            return AuthError.UNKNOWN;
    }
}