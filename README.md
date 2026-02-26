# 🔆 PV Schaltplan Generator

Ein benutzerfreundlicher Web-basierter Generator für professionelle Photovoltaik-Schaltpläne. Erstellen Sie schnell und einfach technische Diagramme für PV-Anlagen mit automatischer Berechnung und Export-Funktionalität.

![PV Schaltplan Generator](https://img.shields.io/badge/Status-Active-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## ✨ Features

### 🏗️ Projektmanagement
- **Projekt erstellen, speichern und laden** - Vollständige Projektverwaltung mit JSON-Export/Import
- **Dynamische ID-Generierung** - Automatische Vergabe eindeutiger IDs für alle Komponenten
- **Projektdaten-Übersicht** - Kompakte Anzeige aller wichtigen Systemdaten

### ⚡ PV-System Konfiguration
- **Modulkonfiguration** - Hersteller, Typ und Leistung (Watt) definieren
- **Solar-Bereiche verwalten** - Beliebig viele PV-Flächen mit individuellen Parametern
- **Wechselrichter-Setup** - Konfiguration von String- und Hybrid-Wechselrichtern
- **Batteriespeicher** - Integration von Speichersystemen in den Schaltplan

### 🗺️ Kartenbasierte Flächenerfassung
- **OpenStreetMap-Integration** - Dachflächen direkt auf der Karte einzeichnen
- **Polygonwerkzeug** - Freie Flächenerfassung per Klick auf der Satellitenansicht
- **Automatische Modulanzahl-Berechnung** - Aus der gezeichneten Fläche wird die maximal mögliche Modulanzahl errechnet

### 📊 Technische Berechnungen
- **Automatische String-Berechnung** - Optimale Modul-Verschaltung
- **Leistungsanalyse** - DC/AC-Leistung pro Bereich und gesamt
- **System-Übersicht** - Kompakte Darstellung aller technischen Daten
- **Effizienz-Berechnung** - Verhältnis zwischen DC- und AC-Leistung

### 🎨 Professionelle Visualisierung
- **SVG-basierte Schaltpläne** - Skalierbare, hochauflösende Diagramme
- **Normgerechte Symbole** - Standard-konforme elektrische Symbole
- **Automatisches Layout** - Intelligente Platzierung aller Komponenten
- **Responsive Design** - Optimiert für verschiedene Bildschirmgrößen

### 🗂️ Sidebar-Navigation
- **Accordion-Verhalten** - Immer nur ein Konfigurationsbereich geöffnet, kein Scrollen durch überladene Seitenleiste
- **Farbcodierung** - Dezente farbige Randstreifen kennzeichnen jeden Bereich (Projekt: Blau, PV-Module: Orange, Solarflächen: Grün, Wechselrichter: Lila, Batterie: Gelb)

### 📄 Export-Funktionen
- **PDF-Export** - Professionelle Dokumente für Kunden und Behörden
- **SVG-Download** - Vektorgrafiken für weitere Bearbeitung
- **Projekt-Backup** - JSON-Format für vollständige Datensicherung

## 🚀 Installation & Setup

### Voraussetzungen
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Keine Server-Installation erforderlich

### Quick Start
1. **Repository klonen**
   ```bash
   git clone https://github.com/mrpfunk/pvplan.git
   cd pvplan
   ```

2. **Anwendung starten**
   ```bash
   # Einfach die HTML-Datei im Browser öffnen
   open src/index.html
   
   # Oder mit einem lokalen Server (empfohlen)
   python -m http.server 8000
   # Dann http://localhost:8000/src öffnen
   ```

3. **Sofort loslegen** 🎉
   - Projekt erstellen oder existierendes laden
   - PV-Module konfigurieren  
   - Solar-Bereiche definieren
   - Wechselrichter hinzufügen
   - Schaltplan generieren und exportieren

## 💡 Verwendung

### 1. Projekt Setup
```
Projekt → Neu → Projektname eingeben → PV-Module konfigurieren
```

### 2. System konfigurieren
- **Module**: Hersteller, Typ und Leistung definieren
- **Solar-Bereiche**: Anzahl Module, Ausrichtung, Strings
- **Wechselrichter**: Typ, Leistung und Zuordnung
- **Batteriespeicher**: Optional für Hybrid-Systeme

### 3. Schaltplan generieren
- Automatische Erstellung des technischen Diagramms
- Live-Vorschau mit allen Komponenten
- Sofortige Berechnung aller Parameter

### 4. Export
- **PDF**: Für offizielle Dokumentation
- **SVG**: Für weitere Bearbeitung
- **Projekt**: Als JSON für spätere Verwendung

## 🏗️ Technische Details

### Architektur
- **Frontend-Only**: Keine Server-Abhängigkeiten
- **Vanilla JavaScript**: Keine Frameworks, maximale Performance
- **SVG-Rendering**: Präzise technische Diagramme
- **Responsive Layout**: CSS Flexbox für alle Bildschirmgrößen

### Komponenten-System
```javascript
// Beispiel der automatischen ID-Generierung
function generateUID() {
  return 'SA' + (++uidCounter).toString(36).toUpperCase();
}

// Smart String-Berechnung
const strings = Math.ceil(modules / 2); // Optimierte Verschaltung
```

### Datei-Struktur
```
pvplan/
├── src/
│   └── index.html         # Hauptanwendung (HTML/CSS/JS)
└── README.md              # Diese Dokumentation
```

## 🛠️ Entwicklung

### Code-Qualität
- **Moderne JavaScript Standards** - ES6+ Features
- **Responsive CSS** - Mobile-first Ansatz  
- **Semantic HTML** - Zugängliche Markup-Struktur
- **Performance-optimiert** - Minimale Abhängigkeiten

### Erweiterungen
Das System ist modular aufgebaut und kann einfach erweitert werden:

```javascript
// Neue Komponenten-Typen hinzufügen
const newComponent = {
  id: generateUID(),
  type: 'inverter',
  specs: { power: 5000, efficiency: 0.97 }
};
```

## 📋 Roadmap

- [ ] **Multi-Language Support** - Englisch, weitere Sprachen
- [ ] **Erweiterte Batteriesysteme** - Mehr Speicher-Optionen
- [ ] **Cloud-Synchronisation** - Online Projekt-Speicherung  
- [ ] **Template-System** - Vorgefertigte Konfigurationen
- [ ] **3D-Visualisierung** - Erweiterte Darstellungsoptionen
- [ ] **API-Integration** - Herstellerdaten automatisch laden

## 🤝 Beitragen

Beiträge sind willkommen! Hier ist wie Sie helfen können:

1. **Fork** das Repository
2. **Feature Branch** erstellen (`git checkout -b feature/AmazingFeature`)
3. **Änderungen committen** (`git commit -m 'Add AmazingFeature'`)
4. **Branch pushen** (`git push origin feature/AmazingFeature`)
5. **Pull Request** öffnen

### Development Guidelines
- Verwenden Sie aussagekräftige Commit-Messages
- Testen Sie alle Änderungen in verschiedenen Browsern
- Halten Sie die Code-Qualität hoch
- Dokumentieren Sie neue Features

## 📜 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 📞 Support & Kontakt

- **Issues**: [GitHub Issues](https://github.com/mrpfunk/pvplan/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mrpfunk/pvplan/discussions)
- **Wiki**: [Dokumentation](https://github.com/mrpfunk/pvplan/wiki)

## 🙏 Danksagungen

- **jsPDF** - PDF-Generation
- **svg2pdf.js** - SVG zu PDF Konvertierung  
- **Inter Font** - Moderne Typografie
- **Community** - Für Feedback und Verbesserungsvorschläge

---

<div align="center">

**⭐ Gefällt Ihnen das Projekt? Geben Sie uns einen Stern!**

[⚡ Live Demo](https://mrpfunk.github.io/pvplan/) | [📖 Wiki](https://github.com/mrpfunk/pvplan/wiki) | [🐛 Issues](https://github.com/mrpfunk/pvplan/issues)

Made with ❤️ für die PV-Community

</div>