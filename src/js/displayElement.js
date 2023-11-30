function showSection(id) {
    // Ocultar todas las secciones
    document.getElementById('event-info').style.display = 'none';
    document.getElementById('gallery-info').style.display = 'none';
    document.getElementById('location-event').style.display = 'none';
    document.getElementById('detail-event').style.display = 'none';

    // Mostrar la sección seleccionada
    document.getElementById(id).style.display = 'block';
    document.getElementById(id + '-button').classList.add('selected');
}