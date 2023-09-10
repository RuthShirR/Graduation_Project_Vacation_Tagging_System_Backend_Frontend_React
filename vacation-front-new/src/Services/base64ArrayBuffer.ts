// Function to convert a file to a base64 string
export function base64ArrayBuffer(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
      const reader = new FileReader(); // Instantiate FileReader to read the file
      reader.readAsArrayBuffer(file);  // Read file as an array buffer

      // On load event handler
      reader.onload = () => {
          if (reader.result instanceof ArrayBuffer) {
              const arrayBuffer: ArrayBuffer = reader.result; // Get the result as ArrayBuffer
              const base64String = arrayBufferToBase64(arrayBuffer); // Convert array buffer to base64 string
              resolve(base64String); // Resolve the Promise with the base64 string
          } else {
              reject("Error converting file to base64."); // Reject if result is not an ArrayBuffer
          }
      };

      // On error event handler
      reader.onerror = () => {
          reject("File read error."); // Reject if an error occurs during reading
      };
  });
}

// Helper function to convert an array buffer to a base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = ""; // Initialize binary string
  const bytes = new Uint8Array(buffer); // Create a byte array from the buffer
  const len = bytes.byteLength; // Get the length of the byte array

  // Iterate through the byte array and build the binary string
  for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
  }

  return btoa(binary); // Convert binary string to base64 and return
}
