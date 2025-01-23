package chocolate.chocoletter.common.exception;

import lombok.Getter;

@Getter
public enum ErrorMessage {

    /**
     * 400 Bad Request
     */
    ERR_MISSING_AUTHORIZATION_CODE,
    ERR_INVALID_REQUEST_FIELD,
    ERR_ALREADY_EXISTS_GIFT,

    /**
     * 401 UNAUTHORIZED
     */
    ERR_UNAUTORIZED,
    ERR_REFRESH_TOKEN_EXPIRED,
    ERR_ACCESS_TOKEN_EXPIRED,
    ERR_INVALID_TOKEN,
    ERR_EMPTY_TOKEN,

    /**
     * 403 FORBIDDEN
     */
    ERR_FORBIDDEN,
    /**
     * /** 404 NOT_FOUND
     */
    ERR_NOT_FOUND,
    ERR_NOT_RESOURCE,
    ERR_NOT_FOUND_GIFT,
    ERR_NOT_FOUND_UNBOXING_ROOM,
    ERR_NOT_FOUND_GIFT_BOX,

    /**
     * 500 INTERNAL_SERVER_ERROR
     */
    ERR_INTERNAL_SERVER_ERROR,
    ERR_INTERNAL_SERVER_SQL_ERROR;

}
