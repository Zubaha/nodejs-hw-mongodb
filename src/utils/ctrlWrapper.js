const ctrlWrapper = (ctrl) => {
    return async (req, res, next) => {
        try {
            await ctrl(req, res);
        } catch (err) {
            next(err);
        }
    };
};

export default ctrlWrapper;
