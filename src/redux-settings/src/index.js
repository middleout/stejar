const database = {};

export const setMountPoint = (identifier, mountPointFn) => {
    if (database[identifier]) {
        throw new Error(`Mount point ${identifier} already exists`);
    }

    database[identifier] = mountPointFn;
};

export const getState = identifier => {
    if (!database[identifier]) {
        throw new Error(`Mount point ${identifier} does not exists`);
    }

    return database[identifier];
};
