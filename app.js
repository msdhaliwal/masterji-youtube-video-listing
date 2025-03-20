const API_URL = 'https://api.freeapi.app/api/v1/public/youtube/videos';
const videoGrid = document.getElementById('videoGrid');
const searchBar = document.getElementById('searchBar');
const noResults = document.getElementById('noResults');

let videos = [];

async function fetchVideos() {
	try {
		const response = await fetch(API_URL);
		const result = await response.json();

		if (result.success && result.data && result.data.data) {
			videos = result.data.data.map((video) => video.items);
			renderVideos(videos);
		} else {
			videoGrid.innerHTML = '<p>Error fetching videos.</p>';
		}
	} catch (error) {
		console.error('Fetch error:', error);
		videoGrid.innerHTML = '<p>Error loading videos.</p>';
	}
}

function renderVideos(videoList) {
	videoGrid.innerHTML = '';

	if (videoList.length === 0) {
		noResults.style.display = 'block';
		return;
	} else {
		noResults.style.display = 'none';
	}

	videoList.forEach((video) => {
		const { id, snippet } = video;
		const title = snippet.title;
		const channelTitle = snippet.channelTitle;
		const thumbnail = snippet.thumbnails.high.url;

		const videoCard = document.createElement('div');
		videoCard.className = 'video-card';

		videoCard.innerHTML = `
      <div class="thumbnail">
        <img src="${thumbnail}" alt="${title}" />
      </div>
      <div class="video-info">
        <div class="video-title">${title}</div>
        <div class="channel-name">${channelTitle}</div>
      </div>
    `;

		videoCard.addEventListener('click', () => {
			window.open(`https://www.youtube.com/watch?v=${id}`, '_blank');
		});

		videoGrid.appendChild(videoCard);
	});
}

searchBar.addEventListener('input', (e) => {
	const query = e.target.value.toLowerCase();
	const filteredVideos = videos.filter(
		(video) =>
			video.snippet.title.toLowerCase().includes(query) ||
			video.snippet.channelTitle.toLowerCase().includes(query)
	);
	renderVideos(filteredVideos);
});

fetchVideos();
