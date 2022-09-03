var _ToastsStore;

if (typeof window !== 'undefined') {
  const { ToastsStore } = require('react-toasts');
  _ToastsStore = ToastsStore
}

export const toaster = async (type, msg) => {
  if (typeof window !== 'undefined') {
    switch (type) {
      case "success":
        return _ToastsStore.success(msg)

      case "error":
        return _ToastsStore.error(msg)

      case "warning":
        return _ToastsStore.warning(msg)

      default:
    }
  }
};
