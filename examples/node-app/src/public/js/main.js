// Theme toggle functionality
document.addEventListener('DOMContentLoaded', function () {
  // You can add theme toggle code here if needed
  console.log('App initialized');

  // Add any additional client-side functionality here
  const handleHtmxResponseEvents = () => {
    document.body.addEventListener('htmx:afterRequest', function (event) {
      console.log('HTMX request completed', event.detail);
    });

    document.body.addEventListener('htmx:responseError', function (event) {
      console.error('HTMX response error', event.detail);
    });
  };

  handleHtmxResponseEvents();
});
