"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("../../src/shared");
var vue_property_decorator_1 = require("vue-property-decorator");
var client_1 = require("@servicestack/client");
var Artist = /** @class */ (function (_super) {
    __extends(Artist, _super);
    function Artist() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.albums = [];
        return _this;
    }
    Object.defineProperty(Artist.prototype, "id", {
        get: function () { return this.row.ArtistId; },
        enumerable: true,
        configurable: true
    });
    Artist.prototype.albumHref = function (albumId) { return "albums?filter=AlbumId:" + albumId; };
    Artist.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'albums', { ArtistId: this.id })];
                    case 1:
                        _a.albums = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Artist = __decorate([
        vue_property_decorator_1.Component({ template: "<div v-if=\"id\">\n    <h5>Albums</h5>\n    <ul>\n        <li v-for=\"x in albums\"><a :href=\"albumHref(x.AlbumId)\">{{x.Title}}</a></li>\n    </ul>\n</div>\n<div v-else class=\"alert alert-danger\">Artist Id needs to be selected</div>"
        })
    ], Artist);
    return Artist;
}(shared_1.RowComponent));
exports.Artist = Artist;
var Album = /** @class */ (function (_super) {
    __extends(Album, _super);
    function Album() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.artist = null;
        _this.tracks = [];
        return _this;
    }
    Object.defineProperty(Album.prototype, "id", {
        get: function () { return this.row.AlbumId; },
        enumerable: true,
        configurable: true
    });
    Album.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, secsToTime, genres, media, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'artists', { ArtistId: this.row.ArtistId })];
                    case 1:
                        _a.artist = (_c.sent())[0];
                        secsToTime = function (s) { return Math.floor(s / 60) + ":" + client_1.padInt(Math.round(s % 60)); };
                        genres = {};
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'genres')];
                    case 2:
                        (_c.sent()).forEach(function (x) { return genres[x.GenreId] = x.Name; });
                        media = {};
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'media_types')];
                    case 3:
                        (_c.sent()).forEach(function (x) { return media[x.MediaTypeId] = x.Name; });
                        _b = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'tracks', { AlbumId: this.id })];
                    case 4:
                        _b.tracks = (_c.sent()).map(function (x) { return ({
                            Name: x.Name,
                            Genre: genres[x.GenreId],
                            Duration: secsToTime(x.Milliseconds / 1000),
                            Price: "$" + x.UnitPrice,
                            Size: Math.floor(x.Bytes / 1024) + " kB",
                            Media: media[x.MediaTypeId],
                        }); });
                        return [2 /*return*/];
                }
            });
        });
    };
    Album = __decorate([
        vue_property_decorator_1.Component({ template: "<div v-if=\"id\">\n    <h4>{{row.Title}} <span class=\"text-muted\">by</span> {{artist.Name}}</h4>\n    <jsonviewer :value=\"tracks\" />\n</div>\n<div v-else class=\"alert alert-danger\">Album Id needs to be selected</div>"
        })
    ], Album);
    return Album;
}(shared_1.RowComponent));
exports.Album = Album;
var Playlist = /** @class */ (function (_super) {
    __extends(Playlist, _super);
    function Playlist() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tracks = [];
        return _this;
    }
    Object.defineProperty(Playlist.prototype, "id", {
        get: function () { return this.row.PlaylistId; },
        enumerable: true,
        configurable: true
    });
    Playlist.prototype.trackHref = function (trackId) { return "tracks?filter=TrackId:" + trackId; };
    Playlist.prototype.mounted = function () {
        return __awaiter(this, void 0, void 0, function () {
            var trackIds, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, shared_1.sharpData(this.db, 'playlist_track', { PlaylistId: this.id, take: 200 })];
                    case 1:
                        trackIds = (_b.sent()).map(function (x) { return x.TrackId; });
                        _a = this;
                        return [4 /*yield*/, shared_1.sharpData(this.db, 'tracks', { TrackId: trackIds.join(',') + ',' })];
                    case 2:
                        _a.tracks = _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Playlist = __decorate([
        vue_property_decorator_1.Component({ template: "<div v-if=\"id\">\n    <div v-if=\"tracks.length\">\n        <h5>Tracks</h5>\n        <ul>\n            <li v-for=\"x in tracks\"><a :href=\"trackHref(x.TrackId)\">{{x.Name}}</a></li>\n        </ul>\n    </div>\n    <div v-else>playlist has no tracks</div>\n</div>\n<div v-else class=\"alert alert-danger\">Playlist Id needs to be selected</div>"
        })
    ], Playlist);
    return Playlist;
}(shared_1.RowComponent));
exports.Playlist = Playlist;
shared_1.dbConfig('chinook', {
    showTables: 'albums,artists,playlists,tracks,genres,media_types,customers,employees,invoices'.split(','),
    tableName: shared_1.splitPascalCase,
    links: {
        albums: {
            ArtistId: function (id) { return "artists?filter=ArtistId:" + id; }
        },
        employees: {
            ReportsTo: function (id) { return "employees?filter=EmployeeId:" + id; }
        },
        invoices: {
            CustomerId: function (id) { return "customers?filter=CustomerId:" + id; }
        },
        tracks: {
            AlbumId: function (id) { return "albums?filter=AlbumId:" + id; },
            MediaTypeId: function (id) { return "media_types?filter=MediaTypeId:" + id; },
            GenreId: function (id) { return "genres?filter=GenreId:" + id; },
        }
    },
    rowComponents: {
        albums: Album,
        artists: Artist,
        playlists: Playlist,
    }
});
