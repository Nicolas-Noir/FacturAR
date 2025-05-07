document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const dropZone = document.getElementById('drop-zone');
  const fileList = document.getElementById('fileList');
  const downloadBtn = document.getElementById('downloadBtn');
  const formatButtons = document.querySelectorAll('.format-btn');
  
  let selectedFormat = 'excel';
  let selectedFiles = [];

  // Manejo del drop zone
  dropZone.addEventListener('click', () => fileInput.click());

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  });

  fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  });

  function handleFiles(files) {
    const pdfFiles = files.filter(file => file.type === 'application/pdf');
    selectedFiles = [...selectedFiles, ...pdfFiles];
    updateFileList();
  }

  function handleFiles(files) {
    selectedFiles = [...selectedFiles, ...files];
    updateFileList();
  }

  function updateFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach(file => {
      const li = document.createElement('li');
      li.classList.add('file-item');
      li.textContent = file.name;
      fileList.appendChild(li);
    });
  }

  formatButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      formatButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedFormat = btn.getAttribute('data-format');
    });
  });

  downloadBtn.addEventListener('click', async () => {
    if (selectedFiles.length === 0) {
      alert('Por favor, selecciona al menos un archivo.');
      return;
    }

    const formData = new FormData();
    selectedFiles.forEach(file => {
      formData.append('files', file);
    });
    formData.append('format', selectedFormat);

    try {
      const response = await fetch('/procesar', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error en el procesamiento');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resultado.${selectedFormat === 'excel' ? 'xlsx' : selectedFormat}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Hubo un problema al procesar el archivo.');
      console.error(err);
    }
  });
});
