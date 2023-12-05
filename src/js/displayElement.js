function showSection(id) {
    // Ocultar todas las secciones
    document.getElementById('event-info').style.display = 'none';
    document.getElementById('gallery-info').style.display = 'none';
    document.getElementById('location-event').style.display = 'none';
    document.getElementById('detail-event').style.display = 'none';

    // Mostrar la sección seleccionada
    document.getElementById(id).style.display = 'block';
}

function backgroundBanner(pathBanner){
    var bannerElement = document.getElementById('banner');
    console.log(pathBanner);
    bannerElement.style.backgroundImage = `url(${pathBanner})`;
}