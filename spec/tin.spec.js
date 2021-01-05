var Tin = require('../src/index');
var testHelper = require('./TestHelper');
var load_map = require('./maps/fushimijo_maplat.json');
var load_cmp = require('./compiled/fushimijo_maplat.json');
var load_m_nara = require('./maps/naramachi_yasui_bunko.json');
var load_c_nara = require('./compiled/naramachi_yasui_bunko.json');
var fs = require('fs');

let stateFull = false;
const testSet = function() {
  describe('実データテスト (Nara)', function() {
    var tin = new Tin({
      wh: [load_m_nara.width, load_m_nara.height],
      strictMode: load_m_nara.strictMode,
      vertexMode: load_m_nara.vertexMode,
      stateFull
    });
    tin.setPoints(load_m_nara.gcps);
    tin.setEdges(load_m_nara.edges);

    it('実データ比較 (Nara)', testHelper.helperAsync(async function() {
      await tin.updateTinAsync();
      const target = JSON.parse(JSON.stringify(load_c_nara));
      expect(tin.getCompiled()).not.toEqual(target.compiled);
      target.compiled.wh = tin.wh;
      expect(JSON.parse(JSON.stringify(tin.getCompiled()))).toEqual(target.compiled);
      fs.writeFileSync('./t_compiled.json', JSON.stringify(target.compiled, null, 2));
      fs.writeFileSync('./e_compiled.json', JSON.stringify(tin.getCompiled(), null, 2));
    }));
  });

  describe('実データテスト (Fushimi)', function() {
    var tin = new Tin({
      wh: [load_map.width, load_map.height],
      strictMode: load_map.strictMode,
      vertexMode: load_map.vertexMode,
      stateFull
    });
    tin.setPoints(load_map.gcps);

    it('実データ比較 (Fushimi)', testHelper.helperAsync(async function() {
      await tin.updateTinAsync();
      const target = JSON.parse(JSON.stringify(load_cmp));
      expect(tin.getCompiled()).not.toEqual(target.compiled);
      target.compiled.wh = tin.wh;
      expect(tin.getCompiled()).toEqual(target.compiled);
    }));
  });


  describe('boundsケーステスト(エラーなし)', function() {
    beforeEach(function () {
      jasmine.addCustomEqualityTester(function floatEquality(a, b) {
        if (a === +a && b === +b && (a !== (a|0) || b !== (b|0))) { // if float
          return Math.abs(a - b) < 5e-8;
        }
      });
    });

    var tin = new Tin({
      bounds: [[100, 50], [150, 150], [150, 200], [60, 190], [50, 100]],
      strictMode: Tin.MODE_STRICT,
      stateFull
    });
    tin.setPoints([[[80, 90], [160, -90]], [[120, 120], [240, -120]], [[100, 140], [200, -140]], [[130, 180], [260, -180]], [[70, 150], [140, -150]]]);

    it('データコンパイルテスト', testHelper.helperAsync(async function() {
      await tin.updateTinAsync();
      expect(tin.xy).toEqual([50, 50]);
      expect(tin.wh).toEqual([100, 150]);
      expect(tin.transform([140, 150])).toEqual([277.25085848926574, -162.19095375292216]);
      expect(tin.transform([277.25085848926574, -162.19095375292216], true)).toEqual([140, 150]);
      expect(tin.transform([200, 130])).toEqual(false);
      expect(tin.transform([401.98029725204117, -110.95171624700066], true)).toEqual(false);
      expect(tin.transform([200, 130], false, true)).toEqual([401.98029725204117, -110.95171624700066], 7);
      expect(tin.transform([401.98029725204117, -110.95171624700066], true, true)).toEqual([200, 130]);
    }));
  });

  describe('boundsケーステスト(エラーあり)', function() {
    var tin = new Tin({
      bounds: [[100, 50], [150, 150], [150, 200], [60, 190], [50, 100]],
      strictMode: Tin.MODE_AUTO,
      stateFull
    });
    tin.setPoints([[[80, 90], [160, -90]], [[120, 120], [240, 120]], [[100, 140], [200, -140]], [[130, 180], [260, 180]], [[70, 150], [140, -150]]]);

    it('データコンパイルテスト', testHelper.helperAsync(async function() {
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_LOOSE);
      var err = '';
      try {
        err = tin.transform([240, 120], true);
      } catch(e) {
        err = e;
      }
      expect(err).not.toEqual('Backward transform is not allowed if strict_status == "strict_error"');
      tin.setStrictMode(Tin.MODE_STRICT);
      await tin.updateTinAsync();
      expect(tin.strict_status).toEqual(Tin.STATUS_ERROR);
      err = '';
      try {
        err = tin.transform([240, 120], true);
      } catch(e) {
        err = e;
      }
      expect(err).toEqual('Backward transform is not allowed if strict_status == "strict_error"');
    }));
  });

  describe('エラーケーステスト', function() {
    it('コンストラクタ', testHelper.helperAsync(async function() {
      var tin;
      var err = '';
      try {
        tin = new Tin({
            stateFull
        });
      } catch (e) {
        err = 'err';
      }
      expect(err).not.toEqual('err');
      tin.setWh([100,100]);
      tin.setPoints([[[20, 20], [20, 20]], [[30, 30], [30, 30]], [[40, 40], [40, 40]]]);
      err = '';
      await tin.updateTinAsync().catch(function(e) {
        err = e;
      });
      expect(err).toEqual('TOO LINEAR1');
    }));
  });
};

describe('Tin 動作テスト', testSet);
stateFull = true;
describe('Tin 動作テスト (StateFull)', testSet);