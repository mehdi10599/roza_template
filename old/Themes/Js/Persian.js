/* Copyright (c) 2010-2022, Persian Language */
Language = 'Farsi';
CsConfirm = 'آیا مطمئن هستید';
CsJavaEnable = 'ابتدا جاوای مرورگر خود را فعال کنید';
CsTry = 'لطفا دوباره سعی کنید';
CsSelectRow = 'ابتدا انتخاب کنید';
CsBack = 'بازگشت';
CsComplete = 'اطلاعات را تکمیل کنید';

CsValidNumber = 'لطفا فقط عدد وارد کنید';
CsValidEmail = 'ایمیل وارد شده نامعتبر است';
CsValidPhone = 'شماره موبایل وارد شده معتبر نمی باشد';
CsValidUrl = 'وب سایت وارد شده نامعتبر است';
CsSendData = "در حال ارسال اطلاعات";
CsSendingData = "<div class='sp-sending'>در حال ارسال اطلاعات <img /></div>";
CsLoadData = "<div class='sp-loading'><img /></div>";
CsLoadingData = "";
CsLanguage = 'fa';
CsAppendFont = 'iransans';
CsSelectFile = 'انتخاب فایل';
CsDragFile = 'برای ارسال فایل را گرفته و روی این قسمت بیندازید';
CsCancel = 'انصراف';
CsProcess = 'در حال انجام عملیات';

Platform.setLanguage({
    'Name': 'Farsi',
    'Words':
    {
        "StartSmartPlatform": "شروع به نصب اسمارت پورتال",
        "ReadySmartPlatform": "اسمارت پورتال آماده به کار است",
        "NotReadySmartPlatform": "اسمارت پورتال آماده به کار نیست",
        "InstalledSmartPlatform": "اسمارت پورتال نصب شدند",
        "InstallPlugins": "پلاگین ها نصب شدند",       
        "InstallFunctions": "توابع نصب شدند",
        "ErrorInUpload": "در بارگذاری خطای وجود دارد",
        "ErrorOpenfile": "در بازکردن فایل خطا وجود دارد",
        "ErrorFindElement": "خطا در پیدا کردن آیتم",
        "ErrorFailedLoad": "بارگذاری به مشکل مواجه شده است",
        "ErrorFindFunction": "خطا در پیدانمودن تابع",
        "FunctionIsActive": "تابع فعال شد",
        "FunctionIsInActive": "تابع غیر فعال شد",
        "ErrorFindRole": "خطا در پیدانمودن نقش",
        "RoleIsActive": "نقش فعال شد",
        "RoleIsInActive": "نقش غیر فعال شد",
        "ErrorInFunction": "خطا در اجرای تابع",
        "ErrorFindData": "خطا در پیدا نمودن اطلاعات",
        "PleaseCheckTarget": "لطفا مقصد را انتخاب کنید",
        "ErrorRequiredData": "ورود اطلاعات باید انجام گردد",
        "ErrorMinLength": "تعداد اطلاعات وارد شده کافی نیست",
        "ErrorMaxLength": "تعداد اطلاعات وارد شده بیشتر از حد می باشد",
        "ErrorMinValue": "مقدار کمتر از حد می باشد",
        "ErrorMaxValue": "مقدار بیشتر از حد می باشد",
        "ErrorEmptySource": "منبع اطلاعات خالی می باشد",
        "ErrorFileSize":"حجم فایل بیش از اندازه می باشد",
        "CanNotSelect":"امکان انتخاب نیست",
        "Confirm": "آیا مطمئن هستید",
        "Back": "بازگشت",
        "Error": "خطا",
        "warning": "هشدار",
        "Information": "اطلاعیه"
    },
    'Number': [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g]
});

function showError(Error) {
    rand = Math.floor(Math.random() * 100);
    Result = "<div class='sp-contianer'>";
    Result += "<div class='sp-center'><img src='/themes/base/Images/error.png' style='width:64px'/></div>";
    Result += "<div class='sp-center'><h2>این صفحه قابل نمایش نمی باشد</h2></div>";
    Result += "<div class='sp-center'>در این صفحه مشكلاتی وجود دارد،تلاش شما برای باز نمودن این فرم باشكست همراه می باشد</div>";
    Result += "<div class='sp-center'><a href=\"JavaScript:void(0)\" ultra-role='dropdown' ultra-target='divError" + rand + "'>توضیحات</a></div>";
    Result += "<div class='sp-center'><div id='divError" + rand + "'>" + Error + "</div></td></tr>";
    Result += "<div class='sp-center'>ویرایش : " + CsVersion + "</div></div>";
    return Result;
}