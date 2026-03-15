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
