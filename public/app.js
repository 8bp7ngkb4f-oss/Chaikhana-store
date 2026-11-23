const WHATSAPP = "46737744063";
const translations = {
fr: {
announcement:"Une maison de thé, un art de vivre · Dakar & au-delà",navStory:"Notre univers",navShop:"La collection",navExperience:"L'expérience",navContact:"Contact",cart:"Panier",
heroEyebrow:"MAISON DE THÉ · DAKAR",heroTitle:"Le thé, élevé<br>au rang d’art.",heroCopy:"Des feuilles choisies avec soin, des instants précieux et une hospitalité qui se savoure.",discover:"Découvrir la collection",heroNote:"L’art de prendre le temps",
introLabel:"L’ESPRIT CHAIKHANA",introTitle:"Une tasse. Un voyage.<br><em>Mille émotions.</em>",introCopy:"CHAIKHANA célèbre la culture du thé à travers une sélection raffinée, des mélanges inspirants et le plaisir de partager. Une maison contemporaine où chaque détail invite à ralentir et à savourer.",knowMore:"Découvrir notre philosophie",
collectionEyebrow:"LA SÉLECTION CHAIKHANA",collectionTitle:"Nos thés & créations",collectionCopy:"Des instants de dégustation à composer selon vos envies.",catalogNote:"Collection de démonstration : les références, formats et prix seront confirmés avant l’ouverture de la boutique.",
quote:"Le luxe véritable réside dans les moments que l’on prend le temps de savourer.",experienceEyebrow:"BIEN PLUS QU’UN THÉ",experienceTitle:"L’expérience<br><em>CHAIKHANA</em>",experienceCopy:"Un univers imaginé autour du goût, du partage et de l’élégance. Retrouvez bientôt notre maison de thé aux Almadies, à Dakar, pour prolonger l’expérience autour d’une tasse.",contactUs:"Nous contacter",
newsletterEyebrow:"RESTONS EN CONTACT",newsletterTitle:"Entrez dans l’univers CHAIKHANA.",newsletterCopy:"Écrivez-nous pour connaître les nouveautés, les collections et les prochaines dégustations.",writeUs:"Écrivez-nous sur WhatsApp",footerTag:"Plus qu’un thé, une expérience.",footerExplore:"Explorer",footerContact:"Contact",rights:"Tous droits réservés.",yourCart:"Votre panier",total:"Total",checkout:"Passer au paiement",secureNote:"Paiement sécurisé via Stripe, après activation du compte marchand.",add:"Ajouter au panier",pricePending:"Prix à confirmer",added:"Ajouté au panier",empty:"Votre panier est encore vide.",priceMissing:"Les prix doivent être configurés avant l’activation des commandes.",paymentSuccess:"Merci ! Votre paiement a été confirmé.",paymentCancelled:"Paiement annulé."
},
en: {
announcement:"A tea house, a way of life · Dakar & beyond",navStory:"Our story",navShop:"The collection",navExperience:"The experience",navContact:"Contact",cart:"Bag",
heroEyebrow:"TEA HOUSE · DAKAR",heroTitle:"Tea, elevated<br>to an art.",heroCopy:"Thoughtfully selected leaves, precious moments and hospitality to be savoured.",discover:"Explore the collection",heroNote:"The art of taking time",
introLabel:"THE CHAIKHANA SPIRIT",introTitle:"One cup. One journey.<br><em>A thousand feelings.</em>",introCopy:"CHAIKHANA celebrates tea culture through a refined selection, inspiring blends and the joy of sharing. A contemporary tea house where every detail invites you to slow down and savour.",knowMore:"Discover our philosophy",
collectionEyebrow:"THE CHAIKHANA SELECTION",collectionTitle:"Our teas & creations",collectionCopy:"Tea moments to discover and make your own.",catalogNote:"Demo collection: product references, formats and prices will be confirmed before the shop opens.",
quote:"True luxury lies in the moments we take time to savour.",experienceEyebrow:"MORE THAN JUST TEA",experienceTitle:"The CHAIKHANA<br><em>experience</em>",experienceCopy:"A world shaped around taste, sharing and elegance. Our tea house is planned for Almadies, Dakar, where you will soon be able to extend the experience over a cup.",contactUs:"Contact us",
newsletterEyebrow:"KEEP IN TOUCH",newsletterTitle:"Step into the world of CHAIKHANA.",newsletterCopy:"Contact us for news, collections and upcoming tasting experiences.",writeUs:"Message us on WhatsApp",footerTag:"More than tea, an experience.",footerExplore:"Explore",footerContact:"Contact",rights:"All rights reserved.",yourCart:"Your bag",total:"Total",checkout:"Proceed to checkout",secureNote:"Secure Stripe checkout, once the merchant account is activated.",add:"Add to bag",pricePending:"Price to be confirmed",added:"Added to your bag",empty:"Your bag is empty for now.",priceMissing:"Product prices must be configured before orders can be activated.",paymentSuccess:"Thank you! Your payment was confirmed.",paymentCancelled:"Payment cancelled."
}};
let lang="fr", products=[], cart=JSON.parse(localStorage.getItem("chaikhana-cart")||"{}");
const $=s=>document.querySelector(s);
function money(cents,currency="eur"){return new Intl.NumberFormat(lang==="fr"?"fr-FR":"en-GB",{style:"currency",currency:currency.toUpperCase()}).format(cents/100)}
function t(k){return translations[lang][k]||k}
function applyLanguage(){
 document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(el=>{const key=el.dataset.i18n;if(translations[lang][key])el.innerHTML=translations[lang][key]});
 $("#langToggle").textContent=lang==="fr"?"EN":"FR";
 renderProducts();renderCart();
}
function renderProducts(){
 const grid=$("#productGrid");
 grid.innerHTML=products.map(p=>{
 const price=p.price>0?money(p.price,p.currency):t("pricePending");
 return `<article class="product-card"><div class="product-photo"><img src="${p.image}" alt="${p.name[lang]}" loading="lazy"><span class="product-tag">${p.tag[lang]}</span></div><div class="product-info"><span class="product-meta">${p.category[lang]} · ${p.weight}</span><h3>${p.name[lang]}</h3><p>${p.description[lang]}</p><div class="product-bottom"><span class="price">${price}</span><button class="add-button" data-add="${p.id}" ${p.price<=0?"disabled":""}>${t("add")}</button></div></div></article>`;
 }).join("");
 grid.querySelectorAll("[data-add]").forEach(btn=>btn.addEventListener("click",()=>addToCart(btn.dataset.add)));
}
function saveCart(){localStorage.setItem("chaikhana-cart",JSON.stringify(cart));renderCart()}
function addToCart(id){cart[id]=(cart[id]||0)+1;saveCart();toast(t("added"))}
function renderCart(){
 const count=Object.values(cart).reduce((a,b)=>a+b,0);$("#cartCount").textContent=count;
 const entries=Object.entries(cart).filter(([id,q])=>q>0).map(([id,q])=>({p:products.find(x=>x.id===id),q})).filter(x=>x.p);
 $("#cartItems").innerHTML=entries.length?entries.map(({p,q})=>`<div class="cart-line"><div><strong>${p.name[lang]}</strong><small>${p.weight} · ${p.price>0?money(p.price,p.currency):t("pricePending")}</small><div class="qty"><button data-dec="${p.id}">−</button><span>${q}</span><button data-inc="${p.id}">+</button></div></div><b>${p.price>0?money(p.price*q,p.currency):"—"}</b></div>`).join(""):`<p class="empty">${t("empty")}</p>`;
 $("#cartTotal").textContent=entries.length&&entries.every(x=>x.p.price>0)?money(entries.reduce((s,x)=>s+x.p.price*x.q,0),entries[0].p.currency):"—";
 $("#cartItems").querySelectorAll("[data-dec]").forEach(b=>b.onclick=()=>{cart[b.dataset.dec]--;if(cart[b.dataset.dec]<=0)delete cart[b.dataset.dec];saveCart()});
 $("#cartItems").querySelectorAll("[data-inc]").forEach(b=>b.onclick=()=>{cart[b.dataset.inc]++;saveCart()});
}
function openCart(v){$("#cartDrawer").classList.toggle("show",v);$("#cartBackdrop").classList.toggle("show",v)}
let toastTimer;function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2800)}
 function checkout(){
 const items=Object.entries(cart).map(([id,quantity])=>({id,quantity}));
 if(!items.length)return;
 if(items.some(x=>{const p=products.find(p=>p.id===x.id);return !p||p.price<=0})){toast(t("priceMissing"));return}
 $("#checkout").disabled=true;
 try{const r=await fetch("/create-checkout-session",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items})});const data=await r.json();if(!r.ok)throw new Error(data.error);location.href=data.url}catch(e){toast(e.message)}finally{$("#checkout").disabled=false}
}



async function init(){
 $("#year").textContent=new Date().getFullYear();
 try{products=await fetch("/api/products").then(r=>r.json())}catch(e){products=[]}
 applyLanguage();
 $("#langToggle").onclick=()=>{lang=lang==="fr"?"en":"fr";applyLanguage()};
 $("#openCart").onclick=()=>openCart(true);$("#closeCart").onclick=()=>openCart(false);$("#cartBackdrop").onclick=()=>openCart(false);$("#checkout").onclick=checkout;
 $("#menuToggle").onclick=()=>$(".nav").classList.toggle("open");
 document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>$(".nav").classList.remove("open")));
 const params=new URLSearchParams(location.search);if(params.get("payment")==="success"){toast(t("paymentSuccess"));cart={};saveCart();history.replaceState({}, "", "/")}else if(params.get("payment")==="cancelled"){toast(t("paymentCancelled"));history.replaceState({}, "", "/")}
}
init();
