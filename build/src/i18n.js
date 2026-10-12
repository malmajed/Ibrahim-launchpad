/* ================= Interface language: English or Arabic =================
   The interface (navigation, home, tracker labels, goals, settings) switches language.
   Missions, cases and practice questions stay in English — the language of the CFA exam —
   and are wrapped with EN() so they keep left-to-right layout inside the Arabic interface.
   Usage: t('English text') returns the Arabic string when LANG is 'ar' and one exists. */
let LANG=(()=>{try{return localStorage.getItem('ilp-lang')==='ar'?'ar':'en'}catch(e){return'en'}})();
const AR={
 // navigation and header
 'Home':'الرئيسية','Tracks':'المسارات','Review':'المراجعة','Case':'الحالة','More':'المزيد','News':'الأخبار','Trading':'التداول',
 'Switch light or dark theme':'تبديل الوضع الفاتح أو الداكن','Switch language':'تبديل اللغة','Cloud sync':'المزامنة السحابية',
 '←':'→','at':'عند',
 // levels and badges
 'Analyst':'محلّل','Senior Analyst':'محلّل أول','Associate':'مشارك','Vice President':'نائب رئيس','Director':'مدير تنفيذي','Portfolio Manager':'مدير محفظة',
 'Promoted to':'ترقية إلى','Badge':'وسام','Badges':'الأوسمة','What you have earned so far':'ما حصلت عليه حتى الآن',
 'First mission':'المهمة الأولى','Five missions':'خمس مهام','Investment Foundations I complete':'إتمام أسس الاستثمار I','MBA Core complete':'إتمام أساسيات الماجستير','Trading track complete':'إتمام مسار التداول',
 'Practice simulator 70%+':'المحاكي التدريبي 70% فأكثر','Perfect test score':'درجة كاملة في اختبار','500 practice questions':'500 سؤال تدريبي','7-day streak':'سلسلة 7 أيام','30-day streak':'سلسلة 30 يومًا',
 '50 reviews':'50 مراجعة','250 reviews':'250 مراجعة','First case of the week':'أول حالة أسبوعية','Four cases of the week':'أربع حالات أسبوعية','First notebook photo':'أول صورة في الدفتر','Hit all weekly targets':'تحقيق جميع أهداف الأسبوع',
 // home
 'Good morning':'صباح الخير','Good afternoon':'مساء الخير','Good evening':'مساء الخير','Level':'المستوى','Streak':'السلسلة','days in a row':'أيام متتالية',
 'Questions this week':'أسئلة هذا الأسبوع','practice questions':'سؤالًا تدريبيًا','Review due':'مراجعة مستحقة','concept cards':'بطاقة مفاهيم',
 'CFA Level I · the main goal':'المستوى الأول من CFA · الهدف الرئيس','CFA study tracker':'متتبّع مذاكرة CFA',
 'Every 2027 learning module · practice accuracy · hours · mocks · readiness':'جميع وحدات منهج 2027 · دقة التدريب · الساعات · الاختبارات التجريبية · الجاهزية',
 'Continue':'متابعة','Up next':'التالي','Open mission':'افتح المهمة','min':'دقيقة','This week':'هذا الأسبوع','Edit goals':'تعديل الأهداف',
 'Case of the week':'حالة الأسبوع','Case archive':'أرشيف الحالات','Review your answers':'راجع إجاباتك','Continue the case':'تابع الحالة','Read the case':'اقرأ الحالة','Done':'منجزة','No cases yet.':'لا توجد حالات بعد.',
 'Spaced review':'المراجعة المتباعدة','cards due. Five minutes keeps the concepts fresh.':'بطاقة مستحقة. خمس دقائق تُبقي المفاهيم حاضرة.','Review now':'راجع الآن',
 // tracks
 'Investment Foundations I':'أسس الاستثمار I','Concept reinforcement aligned to CFA Level I topics':'ترسيخ المفاهيم وفق موضوعات المستوى الأول من CFA',
 'Investment Foundations II':'أسس الاستثمار II','Valuation and analysis in item sets, aligned to CFA Level II topics':'التقييم والتحليل عبر مجموعات الأسئلة، وفق موضوعات المستوى الثاني من CFA',
 'Investment Foundations III':'أسس الاستثمار III','Portfolio and wealth management, aligned to CFA Level III core and pathways':'إدارة المحافظ والثروات، وفق جوهر المستوى الثالث من CFA ومساراته',
 'Investment Foundations II complete':'إتمام أسس الاستثمار II','Investment Foundations III complete':'إتمام أسس الاستثمار III',
 'MBA Core':'أساسيات ماجستير إدارة الأعمال','Accounting, finance, marketing, strategy, economics, data':'المحاسبة والتمويل والتسويق والاستراتيجية والاقتصاد والبيانات',
 'Trading and Technical Analysis':'التداول والتحليل الفني','Market mechanics, indicators, risk and honest backtesting':'آليات السوق والمؤشرات والمخاطر والاختبار التاريخي المنضبط',
 'The CFA missions reinforce concepts from CFA Institute\'s topic outline. They do not replace the official curriculum: the tracker measures your real work in the CFA Institute Learning Ecosystem and your prep provider.':'مهام CFA هنا ترسّخ مفاهيم مخطط موضوعات معهد CFA، ولا تغني عن المنهج الرسمي؛ فالمتتبّع يقيس عملك الفعلي في منصة التعلّم لدى معهد CFA ولدى مزوّد التحضير.',
 'Modules, accuracy, hours, mocks, readiness':'الوحدات والدقة والساعات والاختبارات التجريبية والجاهزية','Practice simulator':'المحاكي التدريبي','Timed questions weighted by the 2027 topic weights':'أسئلة موقوتة موزونة بأوزان موضوعات 2027',
 'of':'من','missions':'مهام','coming soon':'قريبًا','complete':'مكتملة','Track':'المسار','Study tracker':'متتبّع المذاكرة',
 'Each mission: concept cards → a working lab → a self-test → a reflection. Concepts then join your spaced-review deck.':'كل مهمة: بطاقات مفاهيم ← مختبر تطبيقي ← اختبار ذاتي ← تأمّل. ثم تنضم المفاهيم إلى مجموعة المراجعة المتباعدة.',
 'Mission':'المهمة','done':'منجزة','Coming in batch':'تصل في الدفعة','In progress':'قيد التنفيذ','Completed':'مكتملة','Mission complete':'اكتملت المهمة','Lab complete':'اكتمل المختبر',
 // review
 'Done for now ✓':'انتهيت الآن ✓','Nothing due':'لا شيء مستحق','Cards reviewed':'البطاقات المراجَعة','Cards in your deck':'بطاقات مجموعتك','Next due':'الاستحقاق التالي',
 'Finish a mission’s concept cards to add some.':'أنهِ بطاقات المفاهيم في مهمة لإضافة بطاقات.','left':'متبقية','Leitner spacing: 1, 3, 7, 14, 30, 60 days':'تباعد لايتنر: 1، 3، 7، 14، 30، 60 يومًا',
 'Show answer':'أظهر الإجابة','Again':'مجددًا','Hard':'صعبة','Good':'جيدة','Easy':'سهلة','Your deck by box':'مجموعتك حسب الصندوق','Box':'الصندوق','d':'ي','new':'جديدة',
 // goals
 'CFA study hours (logged in the tracker)':'ساعات مذاكرة CFA (المسجّلة في المتتبّع)','Practice questions answered':'الأسئلة التدريبية المُجابة','Missions completed':'المهام المكتملة',
 'personal goals done':'من الأهداف الشخصية منجزة','All weekly targets hit!':'تحققت جميع أهداف الأسبوع!','Weekly goals':'أهداف الأسبوع','Week of':'أسبوع','Targets carry forward to next week.':'تنتقل الأهداف إلى الأسبوع التالي.',
 '300 hours over about 26 weeks is roughly 12 hours a week.':'300 ساعة على نحو 26 أسبوعًا تعني قرابة 12 ساعة أسبوعيًا.','Progress':'التقدّم','Targets':'الأهداف','Personal goals this week':'أهدافك الشخصية هذا الأسبوع',
 'E.g. "Finish the Fixed Income reading on yield measures", "Do one 90-question mock".':'مثال: «إنهاء قراءة مقاييس العائد في الدخل الثابت»، «حل اختبار تجريبي من 90 سؤالًا».','No personal goals yet.':'لا توجد أهداف شخصية بعد.','Add a goal':'أضف هدفًا','Add':'إضافة','Delete':'حذف',
 // more, journal, settings
 'Coverage of the 2027 outline, hours, mocks, readiness':'تغطية منهج 2027 والساعات والاختبارات التجريبية والجاهزية','Targets and personal goals for this week':'أهداف هذا الأسبوع وأهدافك الشخصية',
 'Reflections':'التأمّلات','Everything you have written, by mission':'كل ما كتبته، مرتّبًا حسب المهمة','No reflections yet.':'لا توجد تأمّلات بعد.',
 'Settings':'الإعدادات','Language, theme, sync, backup':'اللغة والمظهر والمزامنة والنسخ الاحتياطي','Sync status':'حالة المزامنة','Cloud sync on':'المزامنة السحابية مفعّلة','Cloud sync is off':'المزامنة السحابية متوقفة',
 'Language and theme':'اللغة والمظهر','The interface can be English or Arabic. Missions, cases and practice questions stay in English, the language of the exam.':'يمكن عرض الواجهة بالعربية أو الإنجليزية، أما المهام والحالات والأسئلة التدريبية فتبقى بالإنجليزية، لغة الاختبار.',
 'Switch light / dark':'تبديل الفاتح / الداكن','Progress saves to a Google Sheet so it follows you across phone, tablet and laptop.':'يُحفظ تقدّمك في جدول Google ليرافقك على الهاتف والجهاز اللوحي والحاسوب.',
 'Apps Script web-app URL':'رابط تطبيق Apps Script','Secret key':'المفتاح السري','Save & sync':'حفظ ومزامنة','Link for your other devices (opens the app already connected)':'رابط لأجهزتك الأخرى (يفتح التطبيق متصلًا)',
 'Copy':'نسخ','Link copied':'نُسخ الرابط','Backup':'النسخ الاحتياطي','Download backup (.json)':'تنزيل نسخة احتياطية (.json)','Restore from backup':'الاستعادة من نسخة احتياطية',
 'Backup restored':'استُعيدت النسخة الاحتياطية','That file is not a Launchpad backup':'هذا الملف ليس نسخة احتياطية للمنصة',
 // sync messages
 'Saving to Drive…':'جارٍ الحفظ في Drive…','Saved to Drive':'حُفظ في Drive','Not saved to Drive':'لم يُحفظ في Drive','Loading from Drive…':'جارٍ التحميل من Drive…','Loaded from Drive':'حُمّل من Drive',
 'Drive is up to date':'Drive محدّث','Could not reach Drive':'تعذّر الوصول إلى Drive','Uploading…':'جارٍ الرفع…','Could not upload':'تعذّر الرفع'
};
const t=s=>LANG==='ar'&&AR[s]!=null?AR[s]:s;
function applyLang(){const h=document.documentElement;h.lang=LANG;h.dir=LANG==='ar'?'rtl':'ltr'}
function setLang(l){LANG=l==='ar'?'ar':'en';try{localStorage.setItem('ilp-lang',LANG)}catch(e){}applyLang();route()}
/* translate static markup tagged with data-i18n (tab labels, header buttons) */
function localize(){$$('[data-i18n]').forEach(e=>{const k=e.dataset.i18n;e.textContent=t(k)});$$('[data-i18n-label]').forEach(e=>{const k=e.dataset.i18nLabel;e.setAttribute('aria-label',t(k));e.title=t(k)})}
