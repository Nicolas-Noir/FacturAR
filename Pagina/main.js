document.addEventListener("DOMContentLoaded", () => {
    // 1. Selección de elementos del DOM
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const downloadBtn = document.getElementById('downloadBtn');
    const formatButtons = document.querySelectorAll('.format-btn');
    
    // 2. Variables de estado
    let selectedFiles = [];
    let selectedFormat = 'excel';
    
    // 3. Función para formatear el tamaño del archivo
    const formatSize = (size) => {
      if (size < 1024) return `${size} bytes`;
      else if (size < 1048576) return `${(size / 1024).toFixed(2)} KB`;
      else return `${(size / 1048576).toFixed(2)} MB`;
    };
    
    // 4. Función para mostrar los archivos en la lista
    const displayFiles = () => {
      fileList.innerHTML = '';
      
      if (selectedFiles.length === 0) {
        fileList.innerHTML = `
          <li class="file-item">
            <div class="file-info">
              <p>No hay archivos seleccionados</p>
            </div>
          </li>
        `;
        return;
      }
      
      selectedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.className = 'file-item';
        
        li.innerHTML = `
          <div class="file-info">
            <p><strong>Nombre:</strong> ${file.name}</p>
            <p><strong>Tamaño:</strong> ${formatSize(file.size)}</p>
            <p><strong>Tipo:</strong> ${file.type || 'Desconocido'}</p>
            <button class="remove-btn" data-index="${index}">×</button>
          </div>
        `;
        
        fileList.appendChild(li);
      });
      
      // Agregar eventos a los botones de eliminar
      document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Evitar que el evento se propague
          const index = parseInt(e.target.dataset.index);
          removeFile(index);
        });
      });
    };
    
    // 5. Función para eliminar un archivo
    const removeFile = (index) => {
      selectedFiles = [...selectedFiles.slice(0, index), ...selectedFiles.slice(index + 1)];
      updateFileInput();
      displayFiles();
    };
    
    // 6. Actualizar el input de archivos
    const updateFileInput = () => {
      const dataTransfer = new DataTransfer();
      selectedFiles.forEach(file => dataTransfer.items.add(file));
      fileInput.files = dataTransfer.files;
    };
    
    // 7. Manejar archivos seleccionados
    const handleFiles = (files) => {
      selectedFiles = [...selectedFiles, ...Array.from(files)];
      updateFileInput();
      displayFiles();
    };
    
    // 8. Evento para abrir el explorador de archivos
    dropZone.addEventListener('click', (e) => {
      // Solo activar si no se hizo clic en un botón de eliminar
      if (!e.target.classList.contains('remove-btn')) {
        fileInput.click();
      }
    });
    
    // 9. Cambio en el input de archivos
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleFiles(fileInput.files);
      }
    });
    
    // 10. Eventos para drag and drop (corregidos)
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropZone.classList.remove('dragover');
      
      // Verificar si hay archivos
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    });
    
    // 11. Prevenir el comportamiento por defecto en el documento
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    document.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    
    // 12. Selección de formato
    formatButtons.forEach(button => {
      button.addEventListener('click', () => {
        formatButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedFormat = button.dataset.format;
      });
    });
    
    // 13. Botón de descarga (simulado)
    downloadBtn.addEventListener('click', () => {
      if (selectedFiles.length === 0) {
        alert('Por favor, selecciona al menos un archivo');
        return;
      }
      
      // Simular procesamiento
      downloadBtn.disabled = true;
      downloadBtn.textContent = 'Procesando...';
      
      setTimeout(() => {
        alert(`Archivos procesados y listos para descargar en formato ${selectedFormat.toUpperCase()}`);
        downloadBtn.disabled = false;
        downloadBtn.textContent = 'Descargar en formato';
      }, 1500);
    });
    
    // 14. Inicializar
    displayFiles();
  });