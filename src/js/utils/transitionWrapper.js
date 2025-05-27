export function renderWithTransition(renderFn) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      renderFn();
    });
  } else {
    renderFn();
  }
}
