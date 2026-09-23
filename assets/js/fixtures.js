// Loads the team fixtures from the club's published Google Sheet and
// shows them on the Teams page. The sheet has one block per team:
//   a row with the team name (and its LTA link), then a header row
//   starting "Day", then one row per match, then a blank row.
(function () {
  var box = document.getElementById('fixtures');
  if (!box) return;

  var CLUB = 'Hampden Park';
  var controls = document.getElementById('fixtures-controls');
  var teamSelect = document.getElementById('fixtures-team');
  var homeOnly = document.getElementById('fixtures-home');
  var showPast = document.getElementById('fixtures-past');
  var teams = [];

  fetch(box.dataset.csv)
    .then(function (response) {
      if (!response.ok) throw new Error(response.status);
      return response.text();
    })
    .then(function (text) {
      teams = readTeams(parseCsv(text));
      if (!teams.length) throw new Error('No fixtures found');
      teams.forEach(function (team, i) {
        teamSelect.add(new Option(team.name, i));
      });
      controls.hidden = false;
      render();
    })
    .catch(function () {
      box.innerHTML = '<p>Sorry, the fixtures couldn\'t be loaded. ' +
        '<a href="' + box.dataset.fallback + '">View them on Google Sheets</a>.</p>';
    });

  [teamSelect, homeOnly, showPast].forEach(function (input) {
    input.addEventListener('change', render);
  });

  function render() {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var html = '';

    teams.forEach(function (team, i) {
      if (teamSelect.value !== '' && Number(teamSelect.value) !== i) return;

      var matches = team.matches.filter(function (m) {
        if (homeOnly.checked && !m.home) return false;
        if (!showPast.checked && m.date && m.date < today) return false;
        return true;
      });

      var hasPlayers = matches.some(function (m) { return m.players; });
      var hasResult = matches.some(function (m) { return m.result; });

      html += '<h3>' + (team.link
        ? '<a href="' + escapeHtml(team.link) + '">' + escapeHtml(team.name) + '</a>'
        : escapeHtml(team.name)) + '</h3>';

      if (!matches.length) {
        html += '<p class="muted">No matches to show.</p>';
        return;
      }

      html += '<table class="stack fixtures-table"><thead><tr><th>Date</th><th>Time</th><th>Opponent</th><th>Venue</th>' +
        (hasPlayers ? '<th>Players</th>' : '') + (hasResult ? '<th>Result</th>' : '') +
        '</tr></thead><tbody>';
      matches.forEach(function (m) {
        html += '<tr><td>' + escapeHtml(m.dateText) + '</td><td>' + escapeHtml(m.time) + '</td>' +
          '<td>' + escapeHtml(m.opponent) + '</td>' +
          '<td><span class="tag ' + (m.home ? 'home' : 'away') + '">' + (m.home ? 'Home' : 'Away') + '</span></td>' +
          (hasPlayers ? '<td>' + escapeHtml(m.players) + '</td>' : '') +
          (hasResult ? '<td>' + escapeHtml(m.result) + '</td>' : '') + '</tr>';
      });
      html += '</tbody></table>';
    });

    box.innerHTML = html;
  }

  // Turns the sheet's rows into [{ name, link, matches: [...] }].
  function readTeams(rows) {
    var list = [];
    var team = null;
    var columns = null;

    rows.forEach(function (row, i) {
      var next = rows[i + 1] || [];
      var cells = row.map(function (c) { return c.trim(); });
      if (!cells.some(Boolean)) return;

      // A team name row is the one just above a "Day, Date, ..." header row.
      if (isHeader(next) && !isHeader(cells)) {
        team = {
          name: cells.filter(function (c) { return c && !/^https?:/.test(c); })[0] || 'Team',
          link: cells.filter(function (c) { return /^https?:/.test(c); })[0] || '',
          matches: []
        };
        list.push(team);
        return;
      }
      if (isHeader(cells)) {
        columns = {};
        cells.forEach(function (c, index) { columns[c.toLowerCase()] = index; });
        return;
      }
      if (!team || !columns) return;

      var get = function (name) { return cells[columns[name]] || ''; };
      var homeTeam = get('home team') || get('home');
      var awayTeam = get('away') || get('away team');
      if (!get('date') && !homeTeam) return;

      var home = homeTeam.indexOf(CLUB) !== -1;
      var date = parseDate(get('date'));
      team.matches.push({
        date: date,
        dateText: date
          ? date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
          : [get('day'), get('date')].join(' ').trim(),
        time: get('time'),
        home: home,
        opponent: home ? awayTeam : homeTeam,
        players: get('players'),
        result: get('result')
      });
    });

    return list.filter(function (t) { return t.matches.length; });
  }

  function isHeader(row) {
    return (row[0] || '').trim().toLowerCase() === 'day';
  }

  // Sheet dates are day/month/year, e.g. 4/10/2026.
  function parseDate(text) {
    var parts = text.split('/');
    if (parts.length !== 3) return null;
    var date = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    return isNaN(date) ? null : date;
  }

  // Minimal CSV reader that copes with quoted cells containing commas or quotes.
  function parseCsv(text) {
    var rows = [];
    var row = [];
    var cell = '';
    var quoted = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cell += ch;
      } else if (ch === '"') quoted = true;
      else if (ch === ',') { row.push(cell); cell = ''; }
      else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
      else if (ch !== '\r') cell += ch;
    }
    if (cell || row.length) { row.push(cell); rows.push(row); }
    return rows;
  }

  function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
})();
