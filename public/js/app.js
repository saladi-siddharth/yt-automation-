document.addEventListener('DOMContentLoaded', () => {
  const terminalBox = document.getElementById('terminalBox');
  const btnGenShort = document.getElementById('btnGenShort');
  const btnGenLong = document.getElementById('btnGenLong');
  const topicHistoryBody = document.getElementById('topicHistoryBody');
  const statFactsTracked = document.getElementById('statFactsTracked');
  
  const studioVideoPlayer = document.getElementById('studioVideoPlayer');
  const playerPlaceholder = document.getElementById('playerPlaceholder');
  const nowPlayingTitle = document.getElementById('nowPlayingTitle');
  const tidbVideoGallery = document.getElementById('tidbVideoGallery');
  
  // Library & Modal Elements
  const fullLibraryGrid = document.getElementById('fullLibraryGrid');
  const librarySearchInput = document.getElementById('librarySearchInput');
  const tabBtns = document.querySelectorAll('.tab-btn');
  const shortsModal = document.getElementById('shortsModal');
  const modalShortTitle = document.getElementById('modalShortTitle');
  const modalShortVideoPlayer = document.getElementById('modalShortVideoPlayer');
  const modalShortMeta = document.getElementById('modalShortMeta');
  const closeShortsModal = document.getElementById('closeShortsModal');

  let libraryData = [];
  let currentFilter = 'all';

  function appendLog(line) {
    const div = document.createElement('div');
    div.textContent = line;
    terminalBox.appendChild(div);
    terminalBox.scrollTop = terminalBox.scrollHeight;
  }

  // Connect WebSocket for streaming logs
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const ws = new WebSocket(`${protocol}//${window.location.host}`);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'log') {
        appendLog(data.message);
      } else if (data.type === 'stats') {
        updateStats(data.stats);
      }
    } catch (e) {
      appendLog(event.data);
    }
  };

  async function fetchStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      updateStats(data);
    } catch (e) {
      console.error(e);
    }
  }

  function updateStats(stats) {
    if (!stats) return;
    statFactsTracked.textContent = `${stats.uniqueFactsTracked || 0} Facts Tracked in Memory`;

    if (stats.recentTopics && stats.recentTopics.length > 0) {
      topicHistoryBody.innerHTML = stats.recentTopics.map(t => `
        <tr>
          <td><span class="${t.type === 'short' ? 'tag-short' : 'tag-long'}">${t.type.toUpperCase()}</span></td>
          <td style="font-weight: 600;">${t.titleHindi}</td>
          <td style="color: var(--accent-gold); font-weight: 800;">${t.viralScore}/100</td>
        </tr>
      `).join('');
    }
  }

  function playMainVideo(videoUrl, title) {
    if (!videoUrl) return;
    studioVideoPlayer.src = videoUrl;
    studioVideoPlayer.style.display = 'block';
    playerPlaceholder.style.display = 'none';
    nowPlayingTitle.textContent = `▶️ Now Playing: ${title}`;
    studioVideoPlayer.play().catch(e => console.log('Autoplay info:', e));
    document.getElementById('playerContainer').scrollIntoView({ behavior: 'smooth' });
  }

  function openShortsModal(item) {
    modalShortTitle.textContent = item.titleHindi;
    modalShortMeta.textContent = `Type: SHORT (9:16) | Generated: ${item.dateFormatted || 'Recently'}`;
    modalShortVideoPlayer.src = item.videoUrl;
    shortsModal.classList.add('open');
    modalShortVideoPlayer.play().catch(e => console.log('Shorts autoplay info:', e));
  }

  closeShortsModal.addEventListener('click', () => {
    shortsModal.classList.remove('open');
    modalShortVideoPlayer.pause();
  });

  shortsModal.addEventListener('click', (e) => {
    if (e.target === shortsModal) {
      shortsModal.classList.remove('open');
      modalShortVideoPlayer.pause();
    }
  });

  // Fetch Library Items
  async function fetchLibrary() {
    try {
      const res = await fetch('/api/library');
      libraryData = await res.json();
      renderLibraryGrid();
    } catch (e) {
      console.error('Failed to fetch media library:', e);
    }
  }

  function renderLibraryGrid() {
    const searchVal = librarySearchInput ? librarySearchInput.value.toLowerCase().trim() : '';
    
    let filtered = libraryData.filter(item => {
      const matchesFilter = currentFilter === 'all' || item.type === currentFilter;
      const matchesSearch = !searchVal || item.titleHindi.toLowerCase().includes(searchVal) || (item.titleEnglish && item.titleEnglish.toLowerCase().includes(searchVal));
      return matchesFilter && matchesSearch;
    });

    if (filtered.length === 0) {
      fullLibraryGrid.innerHTML = `
        <div style="color: var(--text-muted); padding: 40px; text-align: center; grid-column: 1/-1;">
          No matching videos found in Media Library. Click generate above to synthesize new content!
        </div>
      `;
      return;
    }

    fullLibraryGrid.innerHTML = filtered.map(item => {
      const isShort = item.type === 'short';
      return `
        <div class="media-card" data-id="${item.id}">
          <div class="media-thumb-wrap ${isShort ? 'short-aspect' : ''}">
            <img src="${item.thumbnailUrl}" class="media-thumb-img" onerror="this.src='/output/${item.id}/THUMBNAIL_${item.id}.svg'" />
            <div class="play-overlay">
              <div class="play-btn-circle">▶</div>
            </div>
            <span class="${isShort ? 'tag-short' : 'tag-long'}" style="position: absolute; top: 8px; left: 8px; font-size: 10px;">${isShort ? '⚡ SHORT 9:16' : '🎬 LONG 16:9'}</span>
          </div>
          <div class="media-card-body">
            <div class="media-card-title">${item.titleHindi}</div>
            <div class="media-card-meta">
              <span>📅 ${item.dateFormatted || 'Recent'}</span>
              <span style="color: var(--accent-gold); font-weight: 700;">${item.viralScore}/100</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach click handlers to library cards
    document.querySelectorAll('.media-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const item = libraryData.find(i => i.id === id);
        if (!item) return;

        if (item.type === 'short') {
          openShortsModal(item);
        } else {
          playMainVideo(item.videoUrl, item.titleHindi);
        }
      });
    });
  }

  // Filter Tabs Event Listeners
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderLibraryGrid();
    });
  });

  if (librarySearchInput) {
    librarySearchInput.addEventListener('input', renderLibraryGrid);
  }

  async function fetchTiDBVideos() {
    try {
      const res = await fetch('/api/tidb/videos');
      const videos = await res.json();
      renderTiDBGallery(videos);
    } catch (e) {
      console.error('Failed to fetch TiDB videos:', e);
    }
  }

  function renderTiDBGallery(videos) {
    if (!videos || videos.length === 0) {
      tidbVideoGallery.innerHTML = `
        <div style="color: var(--text-muted); font-size: 13px; grid-column: 1/-1; text-align: center; padding: 20px;">
          No video records found in TiDB Cloud Database yet. Click generate above to store your first video!
        </div>
      `;
      return;
    }

    tidbVideoGallery.innerHTML = videos.map(v => {
      const title = v.title_hindi || v.title_english || 'Untitled Video';
      const videoUrl = v.video_url || `/output/${v.output_id}/${v.type === 'short' ? 'SHORT_' + v.output_id + '.mp4' : 'LONG_' + v.output_id + '.mp4'}`;
      const thumbUrl = v.thumbnail_url || `/output/${v.output_id}/THUMBNAIL_${v.output_id}.svg`;
      const isShort = v.type === 'short';

      return `
        <div class="video-card" style="background: rgba(13, 17, 23, 0.8); border: 1px solid var(--panel-border); border-radius: 12px; padding: 10px; cursor: pointer; transition: transform 0.2s;" data-url="${videoUrl}" data-title="${title.replace(/"/g, '&quot;')}" data-type="${v.type}">
          <div style="position: relative; width: 100%; height: 110px; background: #000; border-radius: 8px; overflow: hidden; margin-bottom: 8px;">
            <img src="${thumbUrl}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'" />
            <span class="${isShort ? 'tag-short' : 'tag-long'}" style="position: absolute; top: 6px; left: 6px; font-size: 10px;">${v.type.toUpperCase()}</span>
            <div style="position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.7); color: #fff; font-size: 10px; padding: 2px 6px; border-radius: 4px;">▶ PLAY</div>
          </div>
          <div style="font-size: 12px; font-weight: 700; color: var(--text-main); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</div>
          <div style="font-size: 10px; color: var(--text-muted); margin-top: 4px;">Score: <strong style="color: var(--accent-gold);">${v.viral_score || 95}/100</strong></div>
        </div>
      `;
    }).join('');

    document.querySelectorAll('.video-card').forEach(card => {
      card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        const title = card.getAttribute('data-title');
        const type = card.getAttribute('data-type');
        if (type === 'short') {
          openShortsModal({ videoUrl: url, titleHindi: title, dateFormatted: 'TiDB Cloud Record' });
        } else {
          playMainVideo(url, title);
        }
      });
    });
  }

  btnGenShort.addEventListener('click', async () => {
    btnGenShort.disabled = true;
    appendLog('[Dashboard] Triggering manual Hindi Short generation...');
    try {
      const res = await fetch('/api/generate/short', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        appendLog(`[Dashboard ERROR] ${data.error}`);
      } else if (data.registered && data.registered.titleHindi) {
        appendLog(`[Dashboard] Short Generation Result: "${data.registered.titleHindi}"`);
        fetchLibrary();
        fetchTiDBVideos();
        openShortsModal({
          videoUrl: data.renderManifest ? (data.renderManifest.videoUrl || `/output/${data.outputId}/SHORT_${data.outputId}.mp4`) : `/output/${data.outputId}/SHORT_${data.outputId}.mp4`,
          titleHindi: data.registered.titleHindi,
          dateFormatted: 'Just Generated'
        });
      }
      fetchStats();
    } catch (err) {
      appendLog(`[Dashboard ERROR] ${err.message}`);
    } finally {
      btnGenShort.disabled = false;
    }
  });

  btnGenLong.addEventListener('click', async () => {
    btnGenLong.disabled = true;
    appendLog('[Dashboard] Triggering manual Hindi Long Video generation...');
    try {
      const res = await fetch('/api/generate/long', { method: 'POST' });
      const data = await res.json();
      if (data.error) {
        appendLog(`[Dashboard ERROR] ${data.error}`);
      } else if (data.registered && data.registered.titleHindi) {
        appendLog(`[Dashboard] Long Video Generation Result: "${data.registered.titleHindi}"`);
        fetchLibrary();
        fetchTiDBVideos();
        playMainVideo(data.renderManifest ? (data.renderManifest.videoUrl || `/output/${data.outputId}/LONG_${data.outputId}.mp4`) : `/output/${data.outputId}/LONG_${data.outputId}.mp4`, data.registered.titleHindi);
      }
      fetchStats();
    } catch (err) {
      appendLog(`[Dashboard ERROR] ${err.message}`);
    } finally {
      btnGenLong.disabled = false;
    }
  });

  const btnGenPython = document.getElementById('btnGenPython');
  if (btnGenPython) {
    btnGenPython.addEventListener('click', async () => {
      btnGenPython.disabled = true;
      appendLog('[Dashboard] Triggering Python Advanced ML & NLP Engine...');
      try {
        const res = await fetch('/api/generate/python', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'short' })
        });
        const data = await res.json();
        if (data.error) {
          appendLog(`[Dashboard ERROR] ${data.error}`);
        } else {
          appendLog(`[Dashboard SUCCESS] Python ML Engine execution completed!`);
          fetchLibrary();
          fetchTiDBVideos();
        }
      } catch (err) {
        appendLog(`[Dashboard ERROR] ${err.message}`);
      } finally {
        btnGenPython.disabled = false;
      }
    });
  }

  fetchStats();
  fetchLibrary();
  fetchTiDBVideos();
});
