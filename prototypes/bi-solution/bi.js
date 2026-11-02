/* Rendu des huit écrans B.I Solution. Données fictives, devise CHF, libellés en anglais.
   Page choisie par le hash : bi.html#recap | margin | rfc | bkg | bill | project | sls | supply */
(function () {
  "use strict";

  var M = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var NAV = [
    ["recap", "RECAP"], ["margin", "% Sales Margin"], ["rfc", "RFC"], ["bkg", "BKG"], ["bill", "BILL"],
    ["project", "Project"], ["sls", "SLS"], ["supply", "Supply Chain"]
  ];

  function f(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  function sc(d0, d1, r0, r1) { return function (v) { return r0 + (v - d0) * (r1 - r0) / (d1 - d0); }; }
  function cum(a) { var s = 0; return a.map(function (v) { s += v; return s; }); }
  function svg(w, h, body) { return '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" aria-hidden="true">' + body + "</svg>"; }
  function tx(x, y, s, a, c) { return '<text x="' + x + '" y="' + y + '" text-anchor="' + (a || "middle") + '" class="' + (c || "ax") + '">' + s + "</text>"; }
  function ln(x1, y1, x2, y2) { return '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" class="g"/>'; }
  function rc(x, y, w, h, fill, rx) { return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + Math.max(h, 0).toFixed(1) + '" fill="' + fill + '"' + (rx ? ' rx="' + rx + '"' : "") + "/>"; }
  function path(pts, stroke, dash) {
    return '<polyline class="ln" points="' + pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '" stroke="' + stroke + '"' + (dash ? ' stroke-dasharray="5 4"' : "") + "/>";
  }
  function wave(n, base, amp, ph) {
    var o = [];
    for (var i = 0; i < n; i++) o.push(Math.round((base + amp * Math.sin(i * 1.7 + ph) + amp * 0.6 * Math.cos(i * 0.9 + ph * 2)) * 10) / 10);
    return o;
  }

  /* ---------- briques ---------- */
  function shell(active, bar, content) {
    var menu = NAV.map(function (n, i) {
      return '<a class="' + (n[0] === active ? "on " : "") + (i === 4 ? "sep" : "") + '">' + n[1] + "</a>";
    }).join("");
    return '<div class="app"><aside class="side"><div class="brand"><img src="nexans-logo.png" alt=""><div class="flag"></div></div><nav class="menu">' +
      menu + '</nav></aside><main class="main">' + bar + content + "</main></div>";
  }
  function pill(t, sm) { return '<div class="pill' + (sm ? " sm" : "") + '">' + t + "<i></i></div>"; }
  function tog(t, on) { return '<div class="tog' + (on ? " on" : "") + '"><b></b>' + t + "</div>"; }
  function bar(o) {
    o = o || {};
    var top = '<div class="bar">' + pill("NSSA") + pill(o.interco || "All", true) + tog("Locked control", o.locked !== false) + '<span class="grow"></span>' + pill("Year", true) + "</div>";
    if (o.month) top += '<div class="bar">' + pill(o.month, true) + "</div>";
    return top;
  }
  function chip(c, t) { return '<span class="chip ' + c + '">' + t + "</span>"; }
  function kpi(t, v, delta, up, a, b) {
    return '<div class="card kpi"><h3>' + t + '</h3><div class="v">' + v + "</div>" + chip(up ? "up" : "down", (up ? "↑ " : "↓ ") + delta + " last month") +
      '<div class="row2 mint"><span>' + a[0] + "</span><span>" + a[1] + '</span></div><div class="row2 dark"><span>' + b[0] + "</span><span>" + b[1] + "</span></div></div>";
  }
  function radios(items, on) {
    return '<div class="radios">' + items.map(function (s, i) { return "<span" + (i === on ? ' class="on"' : "") + ">" + s + "</span>"; }).join("") + "</div>";
  }
  function legend(items, cls) {
    return '<div class="legend ' + (cls || "") + '">' + items.map(function (i) { return '<span><em style="--c:' + i[1] + '"></em>' + i[0] + "</span>"; }).join("") + "</div>";
  }
  function table(heads, rows, o) {
    o = o || {};
    var h = "<tr>" + heads.map(function (t, i) { return '<th class="' + (i === o.hl ? "hl " : "") + (i >= (o.num || 99) ? "n" : "") + '">' + t + "</th>"; }).join("") + "</tr>";
    var b = rows.map(function (r) {
      var tot = r[0] === "__tot" ? ' class="tot"' : "";
      if (tot) r = r.slice(1);
      return "<tr" + tot + ">" + r.map(function (c, i) { return '<td class="' + (i >= (o.num || 99) ? "n" : "") + '">' + c + "</td>"; }).join("") + "</tr>";
    }).join("");
    return '<table class="t">' + h + b + "</table>";
  }
  function ring(pct, label, rest, n1, n2) {
    var r = 46, c = 2 * Math.PI * r, d = (pct / 100) * c;
    return '<svg class="chart" viewBox="0 0 400 150" aria-hidden="true"><g transform="translate(95,75) rotate(-90)"><circle r="' + r + '" fill="none" stroke="var(--green)" stroke-width="30"/>' +
      '<circle r="' + r + '" fill="none" stroke="var(--red)" stroke-width="30" stroke-dasharray="' + d.toFixed(1) + " " + c.toFixed(1) + '"/></g>' +
      '<rect x="200" y="44" width="12" height="12" fill="var(--red)" rx="2"/>' + tx(220, 54, label + " " + pct + "% (" + n1 + ")", "start", "lb") +
      '<rect x="200" y="74" width="12" height="12" fill="var(--green)" rx="2"/>' + tx(220, 84, rest + " " + (100 - pct) + "% (" + n2 + ")", "start", "lb") + "</svg>";
  }

  /* ---------- graphiques ---------- */
  function macro() {
    var W = 1100, H = 300, L = 64, R = 1030, T = 10, B = 262, slot = (R - L) / 12, bw = 9;
    var ys = sc(0, 18, B, T), yr = sc(0, 180, B, T);
    var real22 = [5.2, 5.8, 6.0, 12.3, 17.4, 6.3, 4.1, 17.0, 17.3, 16.4, 15.3, 16.7];
    var budget = [9.6, 3.3, 12.0, 8.9, 15.6, 3.4, 10.4, 14.5, 13.9, 7.4, 7.7, 3.6];
    var rfc = [1.5, 9.5, 15.2, 8.6, 15.2, 5.5, 6.8, 17.1, 7.8, 13.2, 1.4, 16.6];
    var real23 = [8.4, 13.4, 10.4, 7.0, 8.6, 12.7, 15.3, 16.6, 10.0, 2.2, 12.6, 11.9];
    var bkg = [6.9, 16.7, 10.8, 11.7, 6.7, 17.0, 15.8, 12.4, 16.8, 2.3, 4.7, 2.5];
    var s = "";
    [0, 4.5, 9, 13.5, 18].forEach(function (v) { s += ln(L, ys(v), R, ys(v)) + tx(L - 8, ys(v) + 4, f(v * 1000), "end") + tx(R + 8, ys(v) + 4, f(v * 10000), "start"); });
    var ser = [[real22, "var(--blue)"], [budget, "var(--red)"], [rfc, "var(--mint)"], [real23, "var(--green)"], [bkg, "var(--pink)"]];
    for (var i = 0; i < 12; i++) {
      var x0 = L + slot * i + (slot - ser.length * bw) / 2;
      ser.forEach(function (sr, k) { s += rc(x0 + k * bw, ys(sr[0][i]), bw - 1, B - ys(sr[0][i]), sr[1]); });
      s += tx(L + slot * i + slot / 2, B + 20, M[i]);
    }
    function pts(a) { return cum(a).map(function (v, i) { return [L + slot * i + slot / 2, yr(v)]; }); }
    s += path(pts(budget), "var(--red)") + path(pts(real23.map(function (v, i) { return v + rfc[i] * 0.2; })), "var(--dark)", true) + path(pts(real23), "var(--green)");
    return svg(W, H, s);
  }
  function lines(series, labels, max, step, W, H) {
    var L = 46, R = W - 14, T = 14, B = H - 30, slot = (R - L) / 12, y = sc(0, max, B, T), s = "";
    for (var v = 0; v <= max; v += step) s += ln(L, y(v), R, y(v)) + tx(L - 8, y(v) + 4, v, "end");
    M.forEach(function (m, i) { s += tx(L + slot * i + slot / 2, B + 20, m); });
    series.forEach(function (sr) {
      var p = sr[0].map(function (v, i) { return [L + slot * i + slot / 2, y(v)]; });
      s += path(p, sr[1]);
      if (labels) sr[0].forEach(function (v, i) { s += '<text x="' + p[i][0].toFixed(1) + '" y="' + (p[i][1] - 7).toFixed(1) + '" text-anchor="middle" class="ax" fill="' + sr[1] + '" style="fill:' + sr[1] + '">' + v + "</text>"; });
    });
    return svg(W, H, s);
  }
  function waterfall() {
    var W = 1100, H = 290, L = 56, R = 1080, T = 14, B = 232, y = sc(0, 2000, B, T), s = "";
    var cats = [["Budget", 1860], ["B&T - Utilities (POWE)", -280], ["ISP - Industry (SPEC)", -140], ["T&D - Operators (FIBN)", -23], ["SLS - PABG (POWA)", -90],
      ["B&T - D&I (EQUI)", -70], ["B&T - Wind (WIND)", 150], ["ISP - Rail (RAIL)", -120]];
    var slot = (R - L) / (cats.length + 1), bw = slot * 0.72, run = 0;
    [0, 500, 1000, 1500, 2000].forEach(function (v) { s += ln(L, y(v), R, y(v)) + tx(L - 8, y(v) + 4, f(v), "end"); });
    cats.forEach(function (c, i) {
      var x = L + slot * i + (slot - bw) / 2, lab = c[0].split(" (");
      if (i === 0) { run = c[1]; s += rc(x, y(run), bw, B - y(run), "var(--dark)", 2) + tx(x + bw / 2, y(run) + 18, f(run), "middle", "lw"); }
      else {
        var from = run, to = run + c[1], top = Math.max(from, to), bot = Math.min(from, to);
        s += rc(x, y(top), bw, y(bot) - y(top), c[1] < 0 ? "var(--red)" : "var(--green)", 2) + tx(x + bw / 2, y(top) - 6, (c[1] > 0 ? "+" : "") + c[1], "middle", "lb");
        run = to;
      }
      s += tx(x + bw / 2, B + 18, lab[0], "middle", "ax") + (lab[1] ? tx(x + bw / 2, B + 32, "(" + lab[1], "middle", "ax") : "");
    });
    var xl = L + slot * cats.length + (slot - bw) / 2;
    s += rc(xl, y(run), bw, B - y(run), "var(--mint)", 2) + tx(xl + bw / 2, y(run) + 18, f(run), "middle", "lb") + tx(xl + bw / 2, B + 18, "RFC", "middle", "ax");
    return svg(W, H, s);
  }
  function stacked(W, H, data, cols, max, step, labels, fmt) {
    var L = 54, R = W - 12, T = 12, B = H - 28, slot = (R - L) / data.length, bw = slot * 0.62, y = sc(0, max, B, T), s = "";
    for (var v = 0; v <= max; v += step) s += ln(L, y(v), R, y(v)) + tx(L - 8, y(v) + 4, fmt ? fmt(v) : f(v), "end");
    data.forEach(function (d, i) {
      var x = L + slot * i + (slot - bw) / 2, acc = 0;
      d.forEach(function (val, k) { s += rc(x, y(acc + val), bw, y(acc) - y(acc + val), cols[k]); acc += val; });
      s += tx(x + bw / 2, B + 18, labels[i]);
    });
    return svg(W, H, s);
  }
  function hbars(items, W, H) {
    var L = 78, R = W - 44, T = 8, rowH = (H - T) / items.length, y, s = "", mx = items[0][1];
    items.forEach(function (it, i) {
      y = T + rowH * i;
      s += tx(L - 10, y + rowH / 2 + 4, it[0], "end") + rc(L, y + 4, (R - L) * it[1] / mx, rowH - 8, "var(--green)", 2) + tx(L + (R - L) * it[1] / mx + 6, y + rowH / 2 + 4, it[1], "start", "lb");
    });
    return svg(W, H, s);
  }
  function treemap() {
    var W = 560, H = 290, s = "";
    var R = [
      ["Switzerland", 0, 0, 38, 42, "var(--green)", 1], ["Sweden", 0, 42, 38, 30, "var(--blue)", 0], ["France", 0, 72, 38, 28, "var(--mint)", 0],
      ["Spain", 38, 0, 32, 47, "var(--dark)", 1], ["Italy", 38, 47, 32, 30, "var(--green)", 1], ["Norway", 38, 77, 32, 23, "var(--blue)", 0],
      ["Latvia", 70, 0, 18, 30, "var(--mint)", 0], ["Peru", 70, 30, 18, 20, "var(--blue)", 0], ["Colombia", 70, 50, 18, 25, "var(--mint)", 0], ["Denmark", 70, 75, 18, 25, "var(--blue)", 0],
      ["Ecuador", 88, 0, 12, 20, "var(--mint)", 0], ["Morocco", 88, 20, 12, 16, "var(--blue)", 0], ["Vietnam", 88, 36, 12, 16, "var(--mint)", 0], ["Turkey", 88, 52, 12, 16, "var(--blue)", 0],
      ["Qatar", 88, 68, 12, 20, "var(--mint)", 0], ["Lebanon", 88, 88, 12, 12, "var(--dark)", 1]
    ];
    R.forEach(function (r) {
      var x = r[1] / 100 * W, y = r[2] / 100 * H, w = r[3] / 100 * W, h = r[4] / 100 * H;
      s += rc(x + 1, y + 1, w - 2, h - 2, r[5], 3) + '<text x="' + (x + 8) + '" y="' + (y + 18) + '" class="' + (r[6] ? "lw" : "lb") + '">' + r[0] + "</text>";
    });
    return svg(W, H, s);
  }
  function combo() {
    var W = 1100, H = 300, L = 60, R = 1040, T = 10, B = 262, n = 21, slot = (R - L) / n, bw = 10, s = "";
    var ys = sc(0, 700, B, T), yn = sc(0, 140, B, T);
    var b1 = wave(n, 230, 70, 1), b2 = wave(n, 190, 90, 3), l1 = wave(n, 62, 14, 0.4), l2 = wave(n, 78, 16, 2);
    [0, 100, 200, 300, 400, 500, 600, 700].forEach(function (v) { s += ln(L, ys(v), R, ys(v)) + tx(L - 8, ys(v) + 4, v ? v + "K" : 0, "end"); });
    [0, 20, 40, 60, 80, 100, 120, 140].forEach(function (v) { s += tx(R + 8, yn(v) + 4, v, "start"); });
    for (var i = 0; i < n; i++) {
      var x = L + slot * i + (slot - 2 * bw) / 2;
      s += rc(x, ys(b1[i]), bw - 1, B - ys(b1[i]), "var(--green)") + rc(x + bw, ys(b2[i]), bw - 1, B - ys(b2[i]), "var(--mint)") + tx(L + slot * i + slot / 2, B + 20, i + 1);
    }
    function p(a) { return a.map(function (v, i) { return [L + slot * i + slot / 2, yn(v)]; }); }
    s += path(p(l1), "var(--red)") + path(p(l2), "var(--dark)");
    return svg(W, H, s);
  }
  function gap() {
    var W = 250, H = 210, B = 168, y = sc(0, 6000, B, 12), s = "", d = [["BKG", 3651, "var(--mint)"], ["Budget", 4750, "var(--dark)"], ["RFC", 5289, "var(--green)"]];
    [0, 1000, 2000, 3000, 4000, 5000].forEach(function (v) { s += ln(44, y(v), W - 6, y(v)) + tx(38, y(v) + 4, f(v), "end"); });
    d.forEach(function (b, i) {
      var x = 56 + i * 62;
      s += rc(x, y(b[1]), 52, B - y(b[1]), b[2]) + tx(x + 26, y(b[1]) + 18, f(b[1]), "middle", b[2] === "var(--mint)" ? "lb" : "lw") + tx(x + 26, B + 18, b[0]);
    });
    return svg(W, H, s);
  }

  /* ---------- pages ---------- */
  var P = {};
  var months = ["Dec 2022", "Jan 2023"];

  P.recap = function () {
    var lg = [["Real 2022 Std MTD", "var(--blue)"], ["Real 2023 Std MTD", "var(--green)"], ["Real+RFC 2023 Std YTD", "var(--dark)"], ["Budget 2023 Std MTD", "var(--red)"],
      ["BKG Confirmed 2023 Std MTD", "var(--pink)"], ["Real 2023 Std YTD", "var(--green)"], ["RFC 2023 Std MTD", "var(--mint)"], ["Budget 2023 YTD", "var(--red)"]];
    return shell("recap", bar({ month: "January" }),
      '<div class="kpis">' +
      kpi("Income performance", "116%", "8%", false, ["Real revenue", "CHF 290K"], ["Budget", "CHF 250K"]) +
      kpi("BKG over Budget", "56.12%", "35%", false, ["BKG", "CHF 148.7K"], ["Budget", "CHF 265K"]) +
      kpi("Sales margin real", "22%", "12%", true, ["Sales margin", "CHF 63.8K"], ["Revenue", "CHF 290K"]) +
      '<div class="card"><h3>Gap Budget vs RFC vs BKG</h3>' + gap() + "</div></div>" +
      '<div class="card"><div class="head"><div><h3>Macro view</h3>' + radios(["Revenue", "Sales margin", "Copper", "Alu", "Km", "COGS"], 0) + "</div>" + legend(lg) + "</div>" + macro() + "</div>");
  };

  P.margin = function () {
    var rfc = [20, 19, 20, 19, 17, 17, 20, 21, 19, 22, 25, 26], std = [22, 20, 15, 21, 22, 19, 28, 24, 22, 20, 28, 23], act = [9, 8, 9, 8, 6, 6, 9, 10, 8, 11, 13, 15];
    var rows = [["__tot", "NSSA", "21.8%", "9.1%", "22.0%", "9.4%"], ["NYY-J 3x1.5 mm²", "24.1%", "10.2%", "25.3%", "10.8%"], ["H07RN-F 4G2.5", "19.6%", "8.4%", "18.9%", "8.1%"],
      ["Cat.7 S/FTP 4P", "27.3%", "12.0%", "28.1%", "12.6%"], ["Fibre OM4 24F", "31.0%", "14.2%", "29.4%", "13.3%"], ["Cu earthing 50 mm²", "14.8%", "5.9%", "15.6%", "6.2%"], ["Alu overhead 95 mm²", "12.2%", "4.7%", "11.8%", "4.5%"]];
    return shell("margin", bar(),
      '<div class="card"><div class="head"><div><h3>Sales margin % trend</h3></div>' + legend([["RFC", "var(--red)"], ["Real Std", "var(--green)"], ["Real Act", "var(--dark)"]], "lt") + "</div>" +
      lines([[rfc, "var(--red)"], [std, "var(--green)"], [act, "var(--dark)"]], true, 40, 10, 1100, 300) + "</div>" +
      '<div class="card"><h3>Margin by article</h3>' + table(["Article"].concat(["MC % Std<br>" + months[0], "MC % Act<br>" + months[0], "MC % Std<br>" + months[1], "MC % Act<br>" + months[1]]), rows, { num: 1, hl: 3 }) + "</div>");
  };

  P.rfc = function () {
    function k(t, a, b, c, up) {
      return '<div class="card kpi"><h3>' + t + '</h3><div class="row2 mint"><span>Current year</span><span>' + a + '</span></div><div class="row2 dark"><span>n-1</span><span>' + b + "</span></div><p class=\"plan\">" + chip(up ? "up" : "down", c) + "</p></div>";
    }
    return shell("rfc", bar({ month: "January" }),
      '<div class="card"><h3>Gap between Budget and RFC, by business line</h3>' + radios(["Revenue", "Sales margin", "Copper", "Alu", "Km", "COGS"], 0) + pill("Full year", true).replace("pill sm", "pill sm sel") + waterfall() + "</div>" +
      '<div class="kpis">' + k("RFC MC Std", "CHF 241K", "CHF 218K", "↑ 10.6% vs n-1", true) + k("BKG MC", "CHF 96K", "CHF 118K", "↓ 18.6% vs n-1", false) + k("MC gap", "CHF 28K", "CHF 21K", "↑ 33.3% vs n-1", true) + k("Tonnes at RFC", "1 420 t", "1 305 t", "↑ 8.8% vs n-1", true) + "</div>");
  };

  P.bkg = function () {
    var rows = [["Alpine Tunnel SA", "PRJ-1042", "500012873", "10", "Late", "NYY-J 3x1.5", "2023-02-14", "18 400", "3 590", "19.5%"],
      ["Helvetia Energie", "PRJ-1051", "500012911", "20", "On time", "H07RN-F 4G2.5", "2023-03-02", "9 750", "1 840", "18.9%"],
      ["Rail Services AG", "PRJ-1063", "500013004", "10", "Blocked", "Cat.7 S/FTP 4P", "2023-03-21", "26 120", "7 330", "28.1%"],
      ["Romande Telecom", "PRJ-1077", "500013078", "30", "On time", "Fibre OM4 24F", "2023-04-05", "31 600", "9 290", "29.4%"],
      ["Bernoise Grid", "PRJ-1089", "500013140", "10", "Late", "Alu overhead 95", "2023-02-27", "14 280", "1 690", "11.8%"],
      ["Lugano Industrie", "PRJ-1094", "500013192", "20", "On time", "Cu earthing 50", "2023-03-30", "6 340", "990", "15.6%"]];
    var cls = { "Late": "late", "On time": "ok", "Blocked": "hold" };
    rows = rows.map(function (r) { r[4] = chip(cls[r[4]], r[4]); return r; });
    return shell("bkg", bar(),
      '<div class="kpis two"><div class="card kpi"><h3>BKG over Budget</h3><div class="v">56.12%</div><div class="row2 mint"><span>BKG</span><span>CHF 148.7K</span></div><div class="row2 dark"><span>Budget</span><span>CHF 265K</span></div></div>' +
      '<div class="card"><h3>% BKG Late + Current month</h3>' + ring(18, "Late", "Current month", 16, 73) + "</div></div>" +
      '<div class="card"><h3>Booked orders</h3>' + pill("All", true).replace("pill sm", "pill sm sel") +
      table(["Sold-to party", "Project definition", "Sales document", "Item", "Order status", "Material", "Requested deliv. date", "BKG sales (std metal, adj.)", "New MC std", "% MC"], rows, { num: 7, hl: 4 }) + "</div>");
  };

  P.bill = function () {
    var rows = [["__tot", "All bill-to parties", "", "4 820", "172 400", "139 500", "19.1%"], ["Alpine Tunnel SA", "NYY-J 3x1.5", "1 200", "18 400", "14 810", "19.5%"],
      ["Helvetia Energie", "H07RN-F 4G2.5", "950", "9 750", "7 910", "18.9%"], ["Rail Services AG", "Cat.7 S/FTP 4P", "1 610", "26 120", "18 790", "28.1%"],
      ["Romande Telecom", "Fibre OM4 24F", "480", "31 600", "22 310", "29.4%"], ["Lugano Industrie", "Cu earthing 50", "580", "6 340", "5 350", "15.6%"]];
    rows[0] = ["__tot", "All bill-to parties", "", "4 820", "172 400", "139 500", "19.1%"];
    return shell("bill", bar(),
      '<div class="kpis two"><div class="card"><h3>% BILL / BKG</h3>' + ring(18, "BILL", "BKG", 16, 73).replace(/var\(--green\)/g, "var(--green)") + "</div>" +
      '<div class="card kpi"><h3>Margin on bookings vs billed</h3><div class="v">18%</div>' + chip("down", "↓ 2 pts below MC BKG") + '<div class="row2 mint"><span>MC BKG</span><span>20%</span></div><div class="row2 dark"><span>MC BILL</span><span>18%</span></div>' +
      '<div class="cmp"><span></span></div><div class="cmpl"><span>CHF 47.7K MC BILL</span><span>CHF 265K sales</span></div></div></div>' +
      '<div class="card"><h3>Billing detail</h3>' + table(["Bill-to party", "Material", "Billed quantity", "Sales at std metal price", "MC std costs", "% MC std"], rows.map(function (r) { return r.length === 7 ? ["__tot"].concat(r.slice(1, 7)).slice(0, 7) : r; }).map(function (r) { if (r[0] === "__tot") return ["__tot", "All bill-to parties", "", "4 820", "172 400", "139 500", "19.1%"].slice(0, 7); return r; }), { num: 2, hl: 5 }) + "</div>");
  };

  P.project = function () {
    var data = M.map(function (m, i) { var c = [170, 220, 100, 150, 90, 185, 140, 245, 390, 280, 160, 350][i], a = [85, 100, 50, 85, 80, 105, 75, 60, 25, 235, 120, 150][i], s = [90, 125, 170, 55, 155, 80, 235, 145, 220, 85, 80, 65][i]; return [c, a, s]; });
    var rows = [["QT-20311", "PRJ-1042", "Alpine Tunnel SA", "Cables", "NYY-J 3x1.5", "On time", "2023-02-14", "18 400"], ["QT-20344", "PRJ-1051", "Helvetia Energie", "Cables", "H07RN-F 4G2.5", "On time", "2023-03-02", "9 750"],
      ["QT-20398", "PRJ-1063", "Rail Services AG", "Accessories", "Cat.7 S/FTP 4P", "Blocked", "2023-03-21", "26 120"], ["QT-20421", "PRJ-1077", "Romande Telecom", "Services", "Fibre OM4 24F", "On time", "2023-04-05", "31 600"],
      ["QT-20456", "PRJ-1089", "Bernoise Grid", "Cables", "Alu overhead 95", "Late", "2023-02-27", "14 280"]];
    var cls = { "Late": "late", "On time": "ok", "Blocked": "hold" };
    rows = rows.map(function (r) { r[5] = chip(cls[r[5]], r[5]); return r; });
    return shell("project", bar(),
      '<div class="card"><div class="head"><div><h3>Product & Services mix</h3></div>' + legend([["Cables", "var(--green)"], ["Accessories", "var(--blue)"], ["Services", "var(--dark)"]], "lt") + "</div>" +
      stacked(1100, 270, data, ["var(--green)", "var(--blue)", "var(--dark)"], 800, 100, M, function (v) { return v ? v + "K" : 0; }) + "</div>" +
      '<div class="card"><h3>Project view</h3>' + table(["Quote / order / project no.", "Project definition", "Sold-to party", "Product family", "Material", "Order status", "Requested deliv. date", "BKG sales"], rows, { num: 7, hl: 3 }) + "</div>");
  };

  P.sls = function () {
    var arts = [860, 754, 739, 540, 481, 380, 271, 180, 140, 120, 101, 75].map(function (v, i) { return ["Article #" + (i + 1), v]; });
    var data = M.map(function (m, i) { return [[165, 220, 100, 150, 90, 185, 135, 245, 385, 280, 160, 350][i], [85, 100, 50, 85, 80, 105, 80, 55, 30, 235, 120, 150][i], [95, 125, 170, 55, 155, 80, 235, 145, 220, 85, 80, 65][i]]; });
    var rows = [["Alpine Tunnel SA", "2023-02-14", "18 400", "19.5%", "1 200"], ["Helvetia Energie", "2023-03-02", "9 750", "18.9%", "950"], ["Rail Services AG", "2023-03-21", "26 120", "28.1%", "1 610"], ["Romande Telecom", "2023-04-05", "31 600", "29.4%", "480"]];
    return shell("sls", bar({ interco: "All" }),
      '<div class="cols2"><div class="card"><h3>Top articles</h3>' + hbars(arts, 560, 300) + '</div><div class="card"><h3>Country mix</h3>' + treemap() + "</div></div>" +
      '<div class="card"><div class="head"><div><h3>Load over the year</h3></div>' + legend([["Client #1", "var(--green)"], ["Client #2", "var(--blue)"], ["Client #3", "var(--dark)"]], "lt") + "</div>" +
      stacked(1100, 260, data, ["var(--green)", "var(--blue)", "var(--dark)"], 800, 100, M, function (v) { return v ? v + "K" : 0; }) + "</div>" +
      '<div class="card"><div class="bar">' + pill("All", true) + tog("Confirmed", true) + "</div><br>" + table(["Client", "Delivery date", "Revenue", "Real MC", "Quantity"], rows, { num: 2, hl: 3 }) + "</div>");
  };

  P.supply = function () {
    var rows = [["1", "500012873", "On time", "NYY-J 3x1.5", "14", "6", "12 400", "2 410", "02-01", "02-02", "02-03"], ["2", "500012911", "On time", "H07RN-F 4G2.5", "9", "4", "7 850", "1 480", "02-01", "02-03", "02-06"],
      ["3", "500013004", "Late", "Cat.7 S/FTP 4P", "22", "11", "26 120", "7 330", "02-02", "02-06", "02-08"], ["4", "500013078", "On time", "Fibre OM4 24F", "11", "5", "31 600", "9 290", "02-03", "02-07", "02-09"]];
    var cls = { "Late": "late", "On time": "ok" };
    rows = rows.map(function (r) { r[2] = chip(cls[r[2]], r[2]); return r; });
    return shell("supply", '<div class="bar">' + pill("January", true) + '<span class="grow"></span>' + pill("2023", true) + "</div>",
      '<div class="card"><div class="head"><div><h3>Daily workload and value</h3></div>' + legend([["BKG sales std metal (adj.)", "var(--green)"], ["BKG std margin value", "var(--mint)"], ["Sales document items", "var(--red)"], ["Operations", "var(--dark)"]], "lt") + "</div>" + combo() + "</div>" +
      '<div class="card"><h3>Order lines</h3>' + table(["Day", "Quote / order / project no.", "Order status", "Article", "Sales document items", "Operations (factor)", "BKG sales", "BKG MC", "Goods ready", "Departure", "Delivery"], rows, { num: 4, hl: 5 }) + "</div>");
  };

  /* menu annoté : cinq pages communes, trois propres à chaque business unit */
  P.menu = function () {
    function grp(items, cls, a, b) {
      return '<div class="mg ' + cls + '"><nav class="menu">' + items.map(function (t, i) { return "<a" + (i === items.length - 1 && cls === "core" ? ' class="sep"' : "") + ">" + t + "</a>"; }).join("") +
        '</nav><i class="br"></i><p><b>' + a + "</b>" + b + "</p></div>";
    }
    return '<div class="mm"><div class="mm-top"><div class="brand"><img src="nexans-logo.png" alt=""><div class="flag"></div></div></div>' +
      grp(["RECAP", "% Sales Margin", "RFC", "BKG", "BILL"], "core", "5 pages communes", "à toutes les business units") +
      grp(["Project", "SLS", "Supply Chain"], "bu", "3 pages propres", "adaptées à chaque business unit") + "</div>";
  };

  /* fiche moteur / boussole remplie : le gabarit complet, avec un vrai exemple */
  P.fiche = function () {
    function blk(title, ask, body) { return '<section class="fb"><h4>' + title + "</h4>" + (ask ? "<em>" + ask + "</em>" : "") + body + "</section>"; }
    function fld(k, t) { return '<p><b>' + k + "</b> " + t + "</p>"; }
    function ul(a) { return "<ul>" + a.map(function (t) { return "<li>" + t + "</li>"; }).join("") + "</ul>"; }
    var gear = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="38" fill="none" stroke="var(--mute)" stroke-width="16" stroke-dasharray="11 7.4"/><circle cx="60" cy="60" r="32" fill="var(--mute)"/><circle cx="60" cy="60" r="15" fill="var(--white)" stroke="var(--dark)" stroke-width="5"/></svg>';
    var comp = '<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="var(--white)" stroke="var(--grid)" stroke-width="8"/><path d="M60 22 L72 60 L60 98 L48 60 Z" fill="var(--dark)"/><path d="M60 22 L72 60 L48 60 Z" fill="var(--green)"/><circle cx="60" cy="60" r="5" fill="var(--white)"/></svg>';
    return '<div class="fi"><header class="fh"><div><h3>Business Goal (Jobs-To-Be-Done) <span>\u2192 What are we trying to achieve?</span></h3>' +
      "<p>Grow sales at a healthy margin: know each month whether we sell at the pace of the budget, without trading margin for volume.</p></div>" +
      '<div class="ic">' + gear + "<i>\u00d7</i>" + comp + "</div></header>" +
      '<div class="fg">' +
      blk("The Engine: Income performance", "", fld("Explanation", "Real revenue of the month against the budget of the month (CHF 290K for CHF 250K, so 116%).") + fld("Purpose", "Tells the sales team whether the pace of selling matches the plan, and where to push.") + fld("Formula", "Source: invoiced revenue and budget file. Filters: entity, interco, locked orders. Logic: real revenue divided by budget, at standard metal price. Timeframe: month and year to date.")) +
      blk("The Compass: Sales margin real", "", fld("Explanation", "Share of the revenue that stays as commercial margin (CHF 63.8K on CHF 290K, so 22%), against the 20% planned.") + fld("Purpose", "Checks that revenue is not bought with price cuts. Raises the alarm when volume grows and margin falls.") + fld("Formula", "Source: invoiced revenue and real costs. Filters: same as the engine. Logic: sales margin divided by revenue. Timeframe: month, against the plan.")) +
      blk("Strategic Tensions &amp; Questions", "\u2192 What trade-offs does this pair help us navigate?", ul(["Push volume now, or protect the margin of the contract?", "Close the month, or wait for a better price next month?", "Which business unit absorbs a low-margin order that opens a market?"])) +
      blk("Edge Cases &amp; Risks", "\u2192 What could go wrong if this pair is used poorly?", ul(["One big low-margin order lifts the engine alone: read both numbers together.", "A move in the metal price changes both numbers with no commercial effort.", "Interco or blocked orders counted in or out change the picture: filters stay visible."])) +
      blk("Format &amp; Surface", "\u2192 Where does this pair show up, and who uses it?", ul(["Surface: RECAP page, top row of cards.", "Audience: business unit directors, sales managers, sales reps.", "Action: revenue above 100% with margin under plan means review pricing before pushing more."])) +
      blk("Metric Ownership", "\u2192 Who is accountable for this pair across time?", ul(["Definition: controlling, with the business unit director.", "Maintenance: the BI team keeps the data model accurate.", "Business tie-in: the business unit director validates the link to the sales goal."])) +
      "</div></div>" +
      '<div class="fs"><div class="fs-col"><span class="tag">Engine</span>' + kpi("Income performance", "116%", "8%", false, ["Real revenue", "CHF 290K"], ["Budget", "CHF 250K"]) + "</div>" +
      '<div class="tens" aria-hidden="true"><svg viewBox="0 0 90 30"><path d="M4 15 H86 M16 5 L4 15 L16 25 M74 5 L86 15 L74 25" fill="none" stroke="var(--dark)" stroke-width="2.5"/></svg><span>tension</span></div>' +
      '<div class="fs-col"><span class="tag c">Compass</span>' + kpi("Sales margin real", "22%", "12%", true, ["Sales margin", "CHF 63.8K"], ["Revenue", "CHF 290K"]) + "</div></div>";
  };

  var key = (location.hash || "#recap").slice(1);
  document.getElementById("root").innerHTML = (P[key] || P.recap)();
})();
