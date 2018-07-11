;

(function() {
  var cells, p, q, r, n = 20, m = 20, days_i = 4, days_r = 8;
  // p : ratio to be infected
  // q : initial ratio to be infected
  // r : initial ratio to be recovered
  // days_i : duration to be infected
  // days_r : duration to be recovered

  function generateCells(n, m) {
    var arr = [];
    for (var i = 0; i < n * m; i++) {
      arr.push(0);
    }
    return arr;
  }

  function initializeDomCells(n, m) {
    var body = document.querySelector('#cells-container');
    body.innerHTML = '';

    var vals_n = 0, vals_i = 0, vals_r = 0;

    for (var x = 0; x < n; x++) {
      for (var y = 0; y < m; y++) {

        var c = document.createElement('div'), cellclass = '',
            nowstate = cells[x + y * n - 1]|0;

        if (nowstate == 0) {
          vals_n++;
        } else if (nowstate <= days_i) {
          vals_i++;
        } else if (nowstate > days_i) {
          vals_r++;
        }

        if (nowstate > 0) {
          cellclass = nowstate > days_i ? ' cell-recovered' : ' cell-infectious';
        }
        c.className = 'cell'+cellclass;
        c.setAttribute('x-pos', x);
        c.setAttribute('y-pos', y);
        body.appendChild(c);
      }
      var br = document.createElement('br');
      body.appendChild(br);
    }
    
    var tr = document.createElement('tr'),
        th = ["Normal", "Infectious", "Recovered"].map(function(t) {
            return '<th>'+t+'</th>';
          }).join(''),
        tr2 = document.createElement('tr'),
        th2 = [vals_n, vals_i, vals_r].map(function(t) {
            return '<td>'+t+'</td>';
          }).join('');
        varea = document.querySelector('#values-area');
    varea.innerHTML = '';
    tr.innerHTML = th; varea.appendChild(tr);
    tr2.innerHTML = th2; varea.appendChild(tr2);
  }

  function doInitialize() {
    cells = generateCells(n, m);

    p = parseFloat(document.querySelector('#value-p').value);
    q = parseFloat(document.querySelector('#value-q').value);
    r = parseFloat(document.querySelector('#value-r').value);
    p = isNaN(p) ? 0.2 : p;
    q = isNaN(q) ? 0.2 : q;
    r = isNaN(r) ? 0.2 : r;

    cells = cells.map(function(x) {
      return Math.random() < q ? 1 : (Math.random() < r ? days_i + 1 : 0);
    });
    initializeDomCells(n, m);
  }

  function doNextStep() {
    var newcells = cells.slice(0); // copy values

    function getCellDiv(x, y) {
      return document.querySelector('div.cell[x-pos="'+x+'"][y-pos="'+y+'"]');
    }

    function calcNextState(x, y) {
      var self = x + y * n - 1;
      var around = [
          self - n - 1, self - n, self - n + 1,
          self - 1, self + 1,
          self + n - 1, self + n, self + n + 1
        ];
      var nowstate = cells[self]|0;
      var i_cells = around.map(function(p) {
            if (p < 0 || p >= cells.length) { return 0; }
            return (cells[p] > 0 && cells[p] <= days_i);
          }).filter(function(v) { return v; }).length;

      if (nowstate == 0) {
        if (i_cells && Math.random() < p) { nowstate = 1; }
      } else {
        nowstate++;
        if (nowstate > days_i + days_r) { nowstate = 0; }
      }
      return nowstate;
    }

    var vals_n = 0, vals_i = 0, vals_r = 0;

    for (var x = 0; x < n; x++) {
      for (var y = 0; y < m; y++) {
        var newstate = calcNextState(x, y);
        newcells[x + y * n - 1] = newstate;

        if (newstate == 0) {
          vals_n++;
        } else if (newstate <= days_i) {
          vals_i++;
        } else if (newstate > days_i) {
          vals_r++;
        }

        var c = getCellDiv(x, y), cellclass = '';
        if (newstate > 0) {
          cellclass = newstate > days_i ? ' cell-recovered' : ' cell-infectious';
        }
        c.className = 'cell'+cellclass;
      }
    }

    var tr = document.createElement('tr'),
        tx = [vals_n, vals_i, vals_r].map(function(t) {
            return '<td>'+t+'</td>';
          }).join('');
        varea = document.querySelector('#values-area');
    tr.innerHTML = tx; varea.appendChild(tr);

    cells = newcells;
  }

  doInitialize();
  document.querySelector('#initialize-doms').addEventListener('click', doInitialize);
  document.querySelector('#nextstep').addEventListener('click', doNextStep);
  document.querySelector('#cells-container').addEventListener('click', doNextStep);
})();
