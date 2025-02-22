module.exports = {
  content: [
    "./dist/script.js",   // Ensure it scans your Chrome extension script
    "./dist/**/*.js", // Scan all JavaScript files inside src/
    "./src/**/*.css", // Scan all JavaScript files inside src/
    "./src/**/*.js", // Scan all JavaScript files inside src/
    "./src/**/*.html", // If you use any HTML files
    "./dist/**/*.html", // If you use any HTML files
    "./dist/index.html" // If you ever reference styles in an index.html
  ],
  purge: [],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
