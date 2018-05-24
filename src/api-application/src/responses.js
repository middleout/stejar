export const createResponseSuccess = (payload, statusCode = 200) => {
    return {
        payload: {
            status: true,
            errors: {},
            body: payload,
        },
        statusCode,
    };
};

export const createResponseError = (field, error, statusCode = 400) => {
    return {
        payload: {
            status: false,
            body: null,
            errors: {
                [field]: error,
            },
        },
        statusCode,
    };
};

export const createResponseErrors = (errors, statusCode = 400) => {
    if (errors instanceof Error) {
        throw errors;
    }

    return {
        payload: {
            status: false,
            body: null,
            errors,
        },
        statusCode,
    };
};
