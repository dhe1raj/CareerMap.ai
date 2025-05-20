
export interface FilePickerOptions {
  accept?: string;
  multiple?: boolean;
}

export function openFilePicker(options: FilePickerOptions = {}): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    
    if (options.accept) {
      input.accept = options.accept;
    }
    
    if (options.multiple) {
      input.multiple = true;
    }
    
    input.style.display = 'none';
    document.body.appendChild(input);
    
    input.addEventListener('change', () => {
      if (input.files) {
        resolve(Array.from(input.files));
      } else {
        resolve([]);
      }
      document.body.removeChild(input);
    });
    
    input.addEventListener('cancel', () => {
      resolve([]);
      document.body.removeChild(input);
    });
    
    // Simulate the click event
    input.click();
  });
}
