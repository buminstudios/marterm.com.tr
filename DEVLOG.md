# 📝 Marterm.com.tr — Geliştirme Günlüğü (Devlog)

> Her oturumun sonunda yapılan işler buraya kaydedilir. Kaldığımız yeri kolayca bulalım.

---

## 📅 14 Mart 2026

### Oturum 1 — Proje Başlangıcı & Tüm Sayfaların Tasarımı
**Yapılanlar:**
- ✅ Anasayfa, Ürünler, Hakkımızda ana yapısı ve içerikleri kodlandı.
- ✅ Galeri Sayfası (`galeri.html`) tasarlandı, modern görsel grid ve etkileşimli Lightbox altyapısı kuruldu.
- ✅ Katalog Sayfası (`katalog.html`) Türkçe ve İngilizce indirme bağlantıları barındıran kart tasarımlarıyla eklendi.
- ✅ İletişim Sayfası (`iletisim.html`) modern form tasarımı, iletişim bilgisi kartları ve harita entegrasyonu ile tamamlandı.
- ✅ `style.css` güncellenerek site boyunca bütünlük sağlandı, yeni sayfa stilleri eklendi.
- ✅ Modern, karanlık tema ağırlıklı, yüksek performanslı ve scroll animasyonlu premium tasarım bütünü tamamlandı.

### Oturum 2 — İçerik Genişletme & Yeni Satış Argümanları
**Yapılanlar (Planlama):**
- Müşteriden gelen yeni marka argümanları (Göçebe Ekonomisi, Akustik performans mekanizması, %60 yalıtım artışı, yanmazlık) `BILGI_OZETI.md` içerisine entegre edildi ve eylem planı (Implementation Plan & Task) hazırlandı.

**Mevcut (Devam Eden) İşlemler:**
- 🔄 **`index.html`** revizyonu: Hero bölgesindeki değer önermelerinin güncellenmesi (%60 performans, yanmazlık vurguları) ve bilgi kartlarına yeni maddelerin yerleştirilmesi uygulması başladı.

**Bekleyen Adımlar:**
- [x] `hakkimizda.html` sayfasına "Göçebe Ekonomisi", "Sosyal Etki" ve "Patentli Ar-Ge" kısımlarının detaylı olarak eklenmesi.
- [x] `urunler.html` sayfasına ses yutumu (pullu keratin yapısı) üzerine infografik / bilimsel açıklamaların tasarlanıp eklenmesi.

---

*Son güncelleme: 14 Mart 2026*

---

## 📅 [14 Mart 2026] - İçerik Optimizasyonu ve Revizyonlar

**Yapılan Değişiklikler:**
- 🔄 **`hakkimizda.html`** güncellendi: "Göçebe Ekonomisi" (%93-97 oran) detaylandırıldı ve sürdürülebilirlik misyonu eklendi.
- 🔄 **`urunler.html`** revize edildi: Pullu keratin yapı ve elektron mikroskobu referansı içeren, ses dalgalarını yutan mekanizma yeni metinlerle vurgulandı. `%60 performans` ve `yanmazlık` eklendi.
- 🔄 **`index.html`** değer önermeleri doğrulandı: `%60 Daha Performanslı`, `Yanmaz & Güvenli`, `Göçebe Ekonomisi` ve `Üstün Ses Yutumu` halihazırda hero ve feature section'da bulunuyor.

**Bekleyen Adımlar:**
- ⚠️ Görüntünün yüklenmesi: `images/keci_kili_mikroskop.jpg` görseli geçici API yoğunluğundan dolayı oluşturulamadı. (Şimdilik boş kalabilir, stok görsel eklenebilir)
- ✅ **`hakkimizda.html`** yapısı onarıldı: Kesik kalan kod yapıları düzeltildi ve liste kapatıldı.

---

## 📅 [15 Mart 2026] - Sürükleyici Apple Tarzı Scroll Deneyimi

**Yapılan Değişiklikler:**
- ✅ **`videolar/herolar`** dizinindeki 120'şer karelik 7 farklı render çıktısı, yüksek kaliteli `.webp` sekansları olarak entegre edildi.
- ✅ **`main.js`**: `HeroScrollSequence` objeleri baştan yazılarak tek bir `ContinuousHeroScroll` kontrolcüsüne dönüştürüldü.
- ✅ **`index.html` & `style.css`**: Hero sahnesi 7 aşamalı devasa bir tuvale (1400vh) dönüştürüldü. Kullanıcı aşağı doğru kaydırdıkça üretim sürecinin tüm aşamaları (Kusursuz Akustik, Termal Direnç, Nefes Alan Yapı vb.) metinlerin yumuşakça belirip kaybolmasıyla (Opacity CSS transition) eşzamanlı olarak arka planda akmaktadır. Devamlılık hissi ve bütünlük %100 oranında sağlandı.

---

## 📅 [16 Mart 2026] - Mobil Uyum ve Etkileşim İyileştirmeleri

**Yapılan Değişiklikler:**
- ✅ **Mobil Menü**: Tek bir overlay sistemi kurularak hem sayfa içi linklere hem de arka plana tıklandığında menünün pürüzsüz kapanması sağlandı.
- ✅ **Video Hero**: WebP sekansları yerine yüksek kaliteli MP4 arka plan videosu eklendi; `object-fit: cover` yapısı korunarak mobil ekranlarda (`100vh`) genişliğin ölçeklendirilmesi sağlandı. Video üzerindeki slogan ve çağrı butonları mobil ekranlarda videoyu perdelememesi adına küçültülerek sol üst köşeye taşındı.
- ✅ **Logo Banner**: Kayar (marquee) logo bandı sonsuz döngü sistemine getirildi, takılmalar giderildi.
- ✅ **Ar-Ge Bölümü Görseli**: `hakkimizda.html` üzerindeki Placeholder "Patentli Ar-Ge Teknolojisi.jpeg" ile değiştirilerek `padding: 0` ve `object-fit: cover` ile kutuya tam olarak oturtuldu.

**Sonuç:** GitHub'a güncel versiyon aktarıldı (Push yapıldı).

---

## 📅 [17 Mart 2026] - Çoklu Dil Sistemi Tamiri & Kapsamlı Kod Temizliği

### Oturum 1 — Dil Sistemi Tamiri

**Tespit Edilen ve Düzeltilen Sorunlar:**

- 🐛 **`build.js` — Boş string fallback hatası:** `("" || key)` ifadesi boş string değerlerini key ismini literal metin olarak render ediyordu. `undefined` kontrolü yapılan güvenli fallback mantığına çevrildi.
- 🐛 **`src/pages/urunler.html` — HTML syntax hatası:** Karşılaştırma tablosunda `class="comparison-table__cell--highlight"` attribute'undan sonra `>` kapanış işareti eksikti. Düzeltildi.
- 🐛 **`src/pages/urunler.html` — Kaçan HTML tagları:** `products_page.science_p2` değeri `{{ }}` double-brace ile kullanılıyordu; `<strong>` tagları `&lt;strong&gt;` olarak render ediliyordu. `{{{ }}}` triple-brace'e çevrildi.
- 🐛 **`src/pages/galeri.html` — Yanlış görsel klasör yolu:** Template `galeri_webp/` klasörüne referans veriyordu, gerçek klasör adı `galeri/`. Tüm 67 görsel yolu düzeltildi.
- 🐛 **`src/pages/galeri.html` — Template key uyuşmazlığı:** `gallery_page.cta_title_suffix` → `gallery_page.cta_title_2` olarak düzeltildi.
- ✅ **Tüm locale dosyalarına eksik keyler eklendi:** `gallery_page`, `catalog_page`, `contact_page`, `about_page` bölümlerindeki onlarca eksik key `tr.json`, `en.json`, `es.json`, `ru.json`, `ar.json` dosyalarına eklendi.

### Oturum 2 — Navigasyon Standardizasyonu

**Tespit Edilen ve Düzeltilen Sorunlar:**

- 🐛 **Hardcoded Türkçe nav etiketleri:** `urunler.html`, `galeri.html`, `katalog.html`, `iletisim.html`, `hakkimizda.html` sayfalarında header, mobile menu ve footer'daki "Hakkımızda" ve "Katalog" metinleri hardcoded yazılmıştı; dil değişince Türkçe kalıyordu. `{{ common.nav_about }}` / `{{ common.nav_catalog }}` template keyleriye değiştirildi.
- 🐛 **`index.html` mobile menu & footer hardcoded:** Anasayfa mobile menu ve footer linkleri tümüyle hardcoded Türkçeydi. `{{ common.nav_* }}` şablonlarıyla değiştirildi.
- 🐛 **`index.html` header — Namespace tutarsızlığı:** Header `{{ nav.corporate }}` = "Kurumsal" kullanıyordu, subpage'ler `{{ common.nav_about }}` = "Hakkımızda" kullanıyordu; aynı link farklı metinler gösteriyordu. `{{ common.nav_about }}` ile standardize edildi.
- ✅ **`about_page` — 85 eksik çeviri keyi:** `en.json`, `es.json`, `ru.json`, `ar.json` dosyalarına R&D, Mission, Environment karşılaştırma tablosu, Fiber mimarisi, Sosyal etki, Akademik raporlar bölümleri için İngilizce çeviriler eklendi.

### Oturum 3 — Kapsamlı Kod Denetimi & Bug Düzeltme

**Tespit Edilen ve Düzeltilen Sorunlar:**

- 🐛 **`main.js` — Double scroll handler (performans bug):** `ContinuousHeroScroll.init()` içinde ayrı bir scroll listener vardı; ana `onScroll` handler da hero'nun `handleScroll()`'ını çağırıyordu → her scroll eventinde 2x hesaplama. İç listener kaldırıldı.
- 🐛 **`main.js` — Sonsuz rAF döngüsü (CPU israfı):** `updateParallax()` fonksiyonu tanımlanmamış `heroContent` değişkenini referans alarak boş bir sonsuz `requestAnimationFrame` döngüsü oluşturuyordu. Tüm kullanılmayan parallax kodu kaldırıldı.
- 🐛 **`main.js` — Ölü değişkenler:** `header`, `lastScroll`, `handleHeaderScroll` — hiçbiri işe yaramıyordu. Kaldırıldı.
- 🐛 **Dil seçici subpage'lerde yoktu:** Lang switcher HTML'i yalnızca `index.html`'de mevcuttu; kullanıcılar `urunler.html`, `hakkimizda.html`, `galeri.html`, `katalog.html`, `iletisim.html` sayfalarından dil değiştiremiyordu. Tüm subpage header'larına eklendi.
- 🐛 **`iletisim.html` — Yanlış nav key:** Nav İletişim butonu `{{ contact_page.hero_eyebrow }}` = "Bize Ulaşın" gösteriyordu. `{{ common.nav_contact }}` = "İletişim" olarak düzeltildi.
- 🐛 **Nav namespace tutarsızlığı:** `index.html` header `{{ nav.* }}` kullanırken mobile menu/footer/subpage'ler `{{ common.nav_* }}` kullanıyordu. Tüm nav referansları `{{ common.nav_* }}`'e standardize edildi.
- 🐛 **"Katalog" vs "E-Katalog" tutarsızlığı:** `common.nav_catalog` "Katalog" gösterirken `nav.catalog` "E-Katalog" gösteriyordu; aynı sayfada header ve mobile menu farklı metin sergiliyordu. Tüm locale dosyalarında `common.nav_catalog` → "E-Katalog" / "E-Catalog" olarak güncellendi.

**Sonuç:** Site genelinde sıfır hardcoded nav metni, sıfır eksik locale key, sıfır ölü JS döngüsü. Build temiz.

---

## 📅 [17 Mart 2026] - Tam Dil Yerelleştirmesi, i18n Otomasyonu ve Final QA

**Yapılan Değişiklikler:**
- ✅ `es`, `ru`, `ar` locale dosyalarındaki eksik uzun içerikler tamamlandı: `hero`, `products_page`, `about_page`, `gallery_page`, `catalog_page` blokları gerçek çeviriyle dolduruldu.
- ✅ `src/pages/urunler.html` içinde iki template bug’ı düzeltildi:
  - `areas_title` bölümünde yanlışlıkla `hero_title` kullanılıyordu, `areas_title_accent` ile değiştirildi.
  - bilimsel açıklama başlığında yanlışlıkla `spec_breath_v` kullanılıyordu, `science_title_accent` ile değiştirildi.
- ✅ `src/pages/hakkimizda.html` içinde sert yazılmış `Patentli` başlık parçası locale anahtarına taşındı; Ar-Ge görselinin `alt` metni de locale bağlı hale getirildi.
- ✅ `src/pages/iletisim.html` içindeki harita `title` alanı locale anahtarına bağlandı.
- ✅ Tüm footer’lardaki sabit `Design by` metni locale sistemine taşındı (`common.footer_credit_prefix`).
- ✅ `src/pages/katalog.html` içindeki sabit `Performance comparisons` metni locale anahtarına taşındı (`catalog_page.en_card_f3`).
- ✅ `build.js` güncellendi; Arapça build çıktıları artık otomatik olarak `dir="rtl"` ile üretiliyor.
- ✅ Kullanılmayan eski `products_page` key’leri (`cat_*`, `item*`, `m_*`, `v_*`) locale dosyalarından temizlendi; i18n raporu gürültüsüz hale getirildi.
- ✅ Yeni otomasyon eklendi:
  - `scripts/i18n-manage.mjs`
  - `npm run i18n:report`
  - `npm run i18n:baseline`
  - `npm run i18n:sync`
- ✅ `README.md` güncellendi; bundan sonra yeni içerik eklerken izlenecek çok dilli akış dokümante edildi.
- ✅ `locales/.translation-meta.json` oluşturuldu; mevcut çeviriler baseline olarak işaretlendi.

**Yapılan Son Kontroller:**
- ✅ `npm run i18n:report` temiz: missing `0`, stale `0`, hardcoded template text `0`.
- ✅ `npm run build` başarılı.
- ✅ Build çıktılarında placeholder (`{{ }}`) kalmadığı doğrulandı.
- ✅ Arapça sayfalarda `lang="ar"` ve `dir="rtl"` doğru üretildi.
- ✅ ES/RU/AR footer kredi metinleri ve katalog/iletişim/hakkımızda lokalizasyon düzeltmeleri build çıktısında doğrulandı.

**Notlar / Sonraki Oturum İçin:**
- Yeni metin eklerken önce `locales/tr.json` içine ekleyin, sonra template’e bağlayın.
- Ardından sırasıyla `npm run i18n:report`, `OPENAI_API_KEY=... npm run i18n:sync`, `npm run build` çalıştırın.
- Lokal preview sunucusu bu oturum sonunda aktif değildi; ihtiyaç olursa proje kökünde statik server tekrar başlatılmalı.

## 📅 [17 Mart 2026] - Oturum 4: Ürünler Sayfası UI & Optimizasyon

**Yapılan Değişiklikler:**
- ✅ **`style.css` - Ürünler Hero Metin İyileştirmesi:** Sola dayalı, başlık bütünlüğünü bozan stil kaldırılarak metinler ortalandı.
- ✅ **`style.css` - Arka Plan Degradesi:** Sağ kısmı aşırı koyu yapan ve detayı gizleyen `product-variants__gradient` yapısı tamamen hafif şeffaf (`rgba(8, 10, 14, 0.4)`) siyah kaplama ile değiştirildi.
- ✅ **`style.css` - Ürün Özellik Kartları (*Variant Cards*):** 
  - Kart içi hizalama CSS kodları sola yaslanacak şekilde ayarlandı (`text-align: left`).
  - Kart içindeki özellik listelerinde metinler solda, değerlerin (`flex-shrink`, `width: 45%`, `text-align: right`) sağ tarafta tamamen hizada kalacağı temiz bir "tablo/grid" tasarımı uygulandı.
- ✅ **Resim Optimizasyonu:** `kece-urunler-hero.jpeg` yüksek çözünürlüklü arka plan resmi `cwebp` kütüphanesi ile `WebP` yapısına (kalite kayıpsız, %80 sıkıştırmalı) dönüştürüldü.
- ✅ **`urunler.html`** içindeki tüm arka plan referansları `.webp` versiyonu ile güncellendi. Ayrıca her varyant içindeki tekrar eden "Ürün Kodu MTMXXXXX" satırları kullanıcının talebiyle gereksiz olduğu için kaldırıldı.
- ✅ **`locales` - Tablo Çeviri Revizyonları:** Karşılaştırma tablosundaki Türkçe isimlendirmeler, firmanın özel isteklerine binaen "Kopma Mukavemeti", "Isıl İletkenlik", "Ortalama Ses Yutum Katsayısı", "Birim Kalınlığın Isıl Direnci" vb. olarak tamamen TR versiyonuna ve tüm diller (EN, RU, AR, ES) eşliğine node betiği (fix) yardımıyla uyarlanarak yeniden derlendi.

**Durum:** Sorunsuz build alındı ve tüm UI/UX geliştirmeleri yayına hazır.

---

## 📅 [18 Mart 2026] - Oturum 5: İçerik Güncellemeleri & Resmi Belgeler

**Yapılan Değişiklikler:**
- ✅ **Galeri Sayfası Filtreleri:** Eksilen "Çatı", "Otomotiv" vb. filtreleme butonları geri getirildi ve çeviri (i18n) alt yapısına uyarlandı.
- ✅ **Ürünler Sayfası "Zemin & Tavan" Etiketleri:** İlgili alana "Halı altı" (Under-carpet) uygulama etiketi tüm diller için eklendi.
- ✅ **Ürünler Sayfası "Akustik" Etiketleri:** "Akustik kumaş" seçeneği eklendi, açıklamaları `locales` üzerinden çoklu dil desteğiyle güncellendi.
- ✅ **Hakkımızda Sayfası Belgeler Alanı:** "Resmi Belgeler" (CE Belgesi vb.) için yeni bir bölüm tasarlandı.
- ✅ **Belge Görüntüleyici (Modal) UX İyileştirmesi:** PDF iframe yapısı daraltılarak modern bir döküman kartına dönüştürüldü. Tıklandığında ekranı karartan ve okunabilir boyutta açılan (sağ tık korumalı) "Modal Pop-up" entegrasyonu sağlandı.

**Durum:** İlgili HTML dosyaları ve `locales/*.json` çevirileri tamamlandı. `node build.js` ile tüm diller başarıyla derlendi. İşlemler sorunsuz ve yayına hazır.

## 15 Şubat 2026

**News & Catalog PDF Fixesi Yeniden Uygulandı**
- `git reset` veya silinme sebebiyle kaybolduğu sanılan bazı değişiklikler (News kısmı) tekrar Node.js betikleriyle HTML dosyalarına (Tüm diller) implemente edildi.
- E-Katalog butonuna tıklandığında popup (modal) açılması yerine, doğrudan PDF bağlantısına (`Marterm-TR.pdf` ve `Marterm-ENG.pdf` olarak) gidilmesi için ilgili butonlar dillerde güncellendi.
- Koyu/Açık Tema (Dark/Light mode) özelliğinin kodlarda zaten mevcut olduğu ve aktif çalıştığı teyit edildi.

**Hakkımızda Section Restored**
- User's manual modifications (Prof. Dr. İbrahim Yıldız, Doç. Dr. Ayşe Yılmaz, and Sertifika titles) were done directly in the `pages/hakkimizda.html` root directory instead of the build source system (`locales/tr.json`).
- These changes were being overwritten during `node build.js`. 
- Extracted the local changes from git history & the root `pages/` folder, and securely placed them into `locales/tr.json` so they are now preserved across builds.
