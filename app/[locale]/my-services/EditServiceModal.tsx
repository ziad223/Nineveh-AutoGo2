"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FiTrash2, FiPlus, FiImage, FiX, FiCheck, FiAlertCircle } from "react-icons/fi";
import Image from "next/image";
import apiServiceCall from "../../../src/lib/apiServiceCall";
import CustomSelect from "../../../src/components/shared/reusableComponents/CustomSelect";

const EditServiceModal = ({ open, onClose, service, token, onSuccess }: any) => {
  const locale = useLocale();
  const t = useTranslations("services");
  const [features, setFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // تحديد الحقول بناءً على اللغة
  const isArabic = locale === "ar";
  
  // إعداد القيم الافتراضية بناءً على اللغة
  const defaultValues = isArabic
    ? {
        catalog_category_id: "",
        title: service?.title?.ar || service?.title || "",
        content: service?.content?.ar || service?.content || "",
        price: "",
        phone: "",
        mobile: "",
      }
    : {
        catalog_category_id: "",
        title: service?.title?.en || service?.title || "",
        content: service?.content?.en || service?.content || "",
        price: "",
        phone: "",
        mobile: "",
      };

  // إعداد react-hook-form
  const { control, handleSubmit, reset, formState: { errors }, register } = useForm({
    defaultValues,
  });

  // جلب الفئات من API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await apiServiceCall({
          url: "categories",
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response?.data) {
          const formattedCategories = response.data.map((cat: any) => ({
            id: cat.id,
            name: cat.name,
          }));
          setCategories(formattedCategories);
        }
      } catch (error) {
        console.error("خطأ في جبل الفئات:", error);
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open && token) {
      fetchCategories();
    }
  }, [open, token]);

  // تهيئة البيانات عند فتح المودال
  useEffect(() => {
    if (service && open) {
      setFeatures(service.feature_preview ? [...service.feature_preview] : []);
      setExistingImages(service.images ? [...service.images] : []);
      setImages([]);
      setImageErrors([]);
      setSuccess(false);

      // تعيين القيم في الفورم بناءً على اللغة
      if (isArabic) {
        reset({
          catalog_category_id: service.catalog_category_id?.toString() || "",
          title: service?.title?.ar || service?.title || "",
          content: service?.content?.ar || service?.content || "",
          price: service?.price?.toString() || "",
          phone: service?.phone || "",
          mobile: service?.mobile || "",
        });
      } else {
        reset({
          catalog_category_id: service.catalog_category_id?.toString() || "",
          title: service?.title?.en || service?.title || "",
          content: service?.content?.en || service?.content || "",
          price: service?.price?.toString() || "",
          phone: service?.phone || "",
          mobile: service?.mobile || "",
        });
      }
    }
  }, [service, open, reset, isArabic]);

  const handleAddFeature = () => {
    if (newFeature.trim() === "") return;
    setFeatures([...features, newFeature.trim()]);
    setNewFeature("");
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validImageTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/gif', 
      'image/webp',
      'image/svg+xml'
    ];
    
    const newImages: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach((file) => {
      // التحقق من نوع الملف
      if (!validImageTypes.includes(file.type)) {
        errors.push(`الملف "${file.name}" ليس صورة صالحة. النوع: ${file.type}`);
        return;
      }

      // التحقق من حجم الملف (5MB كحد أقصى)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.push(`الملف "${file.name}" كبير جداً. الحد الأقصى: 5MB`);
        return;
      }

      // التحقق من امتداد الملف
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
      const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(fileExtension)) {
        errors.push(`الملف "${file.name}" له امتداد غير صالح`);
        return;
      }

      newImages.push(file);
    });

    if (errors.length > 0) {
      setImageErrors(errors);
      setTimeout(() => setImageErrors([]), 5000);
    }

    if (newImages.length > 0) {
      setImages(prev => [...prev, ...newImages]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit = async (formValues: any) => {
    // التحقق من الصور قبل الإرسال
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    const invalidImages: string[] = [];
    
    images.forEach((image) => {
      if (!validImageTypes.includes(image.type)) {
        invalidImages.push(`"${image.name}"`);
      }
    });

    if (invalidImages.length > 0) {
      setImageErrors([`الصور التالية غير صالحة: ${invalidImages.join(', ')}`]);
      return;
    }

    setIsLoading(true);
    setImageErrors([]);

    try {
      const formData = new FormData();

      // إضافة الحقول الأساسية بناءً على اللغة
      formData.append("catalog_category_id", formValues.catalog_category_id);
      
      if (isArabic) {
        formData.append("title[ar]", formValues.title?.trim() || "");
        formData.append("title[en]", ""); // إرسال حقل فارغ للإنجليزية
        formData.append("content[ar]", formValues.content?.trim() || "");
        formData.append("content[en]", ""); // إرسال حقل فارغ للإنجليزية
      } else {
        formData.append("title[ar]", ""); // إرسال حقل فارغ للعربية
        formData.append("title[en]", formValues.title?.trim() || "");
        formData.append("content[ar]", ""); // إرسال حقل فارغ للعربية
        formData.append("content[en]", formValues.content?.trim() || "");
      }
      
      formData.append("price", formValues.price || "0");
      formData.append("phone", formValues.phone?.trim() || "");
      formData.append("mobile", formValues.mobile?.trim() || "");

      // إضافة الميزات
      features.forEach((feature, index) => {
        formData.append(`features[${index}]`, feature);
      });

      // إضافة الصور الجديدة
      images.forEach((image) => {
        formData.append("images[]", image);
      });

      // إضافة الصور الموجودة
      existingImages.forEach((img) => {
        formData.append("existing_images[]", img);
      });


      // استخدم الـ URL الصحيح بناءً على ما إذا كان إنشاء أو تحديث
      const isUpdate = service?.id;
      const url = isUpdate ? `user/services/${service.id}` : 'user/create/services';
      const method = isUpdate ? "POST" : "POST";

      const data = await apiServiceCall({
        url: url,
        method: method,
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': "multipart/form-data",
          "Accept-Language": locale
        },
      });

      setSuccess(true);
      
      // إعادة تحميل الصفحة بعد ثانيتين أو استدعاء callback
      setTimeout(() => {
        onClose();
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      }, 1500);

    } catch (error: any) {
      console.error("❌ خطأ:", error);
      
      let errorMessage = "حدث خطأ أثناء حفظ الخدمة";
      
      if (error?.message) {
        errorMessage = error.message;
      }
      
      if (error?.errors) {
        console.error("تفاصيل الأخطاء:", error.errors);
        
        // معالجة أخطاء الصور
        if (error.errors.images || error.errors['images.*']) {
          const imageErrors = error.errors.images || error.errors['images.*'];
          setImageErrors(Array.isArray(imageErrors) ? imageErrors : [imageErrors]);
          errorMessage = "هناك مشكلة في الصور المرفوعة";
        }
      }
      
      setImageErrors(prev => [...prev, errorMessage]);
      
    } finally {
      setIsLoading(false);
    }
  };

  // تحويل categories للصيغة المطلوبة للـ CustomSelect
  const categoryOptions = categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl rounded-xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {service?.id ? t("editService") : t("createService")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={isLoading}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* رسالة النجاح */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <FiCheck className="text-green-600" size={24} />
            <div>
              <p className="text-green-800 font-medium">تم حفظ الخدمة بنجاح</p>
              <p className="text-green-600 text-sm">جاري إعادة التوجيه...</p>
            </div>
          </div>
        )}

        {/* عرض الأخطاء */}
        {imageErrors.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="text-red-600 mt-1" size={20} />
              <div className="flex-1">
                <p className="text-red-800 font-medium mb-2">يوجد أخطاء تحتاج للتعديل:</p>
                <ul className="text-red-600 text-sm space-y-1">
                  {imageErrors.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* معلومات أساسية */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('basic_information')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* الفئة */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("category")} <span className="text-red-500">*</span>
                </label>
                {loadingCategories ? (
                  <div className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ) : (
                  <CustomSelect
                    name="catalog_category_id"
                    control={control}
placeholder={t('selectCategory')}
                    options={categoryOptions}
                    rules={{ required: "الفئة مطلوبة" }}
                  />
                )}
                {errors.catalog_category_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.catalog_category_id.message}</p>
                )}
              </div>

              {/* العنوان */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('address')} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("title", { 
                    required: "العنوان مطلوب",
                    minLength: { value: 3, message: "يجب أن يكون العنوان 3 أحرف على الأقل" }
                  })}
                  placeholder={isArabic ? "أدخل العنوان" : "Enter title"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                )}
              </div>

              {/* الوصف */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("content", { 
                    required: "الوصف مطلوب",
                    minLength: { value: 10, message: "يجب أن يكون الوصف 10 أحرف على الأقل" }
                  })}
                  placeholder={isArabic ? "أدخل الوصف" : "Enter description"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none min-h-[100px] transition-all"
                />
                {errors.content && (
                  <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
                )}
              </div>

              {/* السعر */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('price')} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("price", { 
                    required: "السعر مطلوب",
                    min: { value: 0, message: "السعر يجب أن يكون أكبر من 0" }
                  })}
                  type="number"
                  step="0.01"
                  placeholder={isArabic ? "أدخل السعر" : "Enter price"}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
                {errors.price && (
                  <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                )}
              </div>

              {/* الهاتف والموبايل */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الهاتف" : "Phone"}
                  </label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder={isArabic ? "أدخل رقم الهاتف" : "Enter phone number"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {isArabic ? "الموبايل" : "Mobile"}
                  </label>
                  <input
                    {...register("mobile")}
                    type="tel"
                    placeholder={isArabic ? "أدخل رقم الموبايل" : "Enter mobile number"}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* الميزات */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isArabic ? "الميزات" : "Features"}
              </h3>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                {features.length} {isArabic ? "ميزة" : "features"}
              </span>
            </div>

            {/* عرض الميزات */}
            {features.length > 0 && (
              <div className="mb-4 space-y-2 max-h-48 overflow-y-auto p-3 bg-white rounded-lg border">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 transition-colors hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                      <span className="text-sm text-gray-800 flex-1">{feature}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(index)}
                      className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* إضافة ميزة جديدة */}
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder={isArabic ? "أدخل ميزة جديدة" : "Enter new feature"}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddFeature}
                disabled={!newFeature.trim()}
                className="bg-primary text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
              >
                <FiPlus size={18} />
                <span className="text-sm font-medium">{isArabic ? "إضافة" : "Add"}</span>
              </button>
            </div>
          </div>

          {/* الصور */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {isArabic ? "الصور" : "Images"}
              </h3>
              <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full">
                {existingImages.length + images.length} {isArabic ? "صورة" : "images"}
              </span>
            </div>

            {/* معلومات الصور */}
            <p className="text-xs text-gray-500 mb-4 bg-white p-3 rounded-lg border">
              {isArabic ? (
                <>
                  <span className="font-medium">الأنواع المقبولة:</span> JPG, PNG, GIF, WebP, SVG
                  <span className="mx-2">•</span>
                  <span className="font-medium">الحجم الأقصى:</span> 5MB للصورة
                </>
              ) : (
                <>
                  <span className="font-medium">Accepted formats:</span> JPG, PNG, GIF, WebP, SVG
                  <span className="mx-2">•</span>
                  <span className="font-medium">Max size:</span> 5MB per image
                </>
              )}
            </p>

            {/* الصور الموجودة */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {isArabic ? "الصور الحالية:" : "Current images:"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={img}
                          alt={`${isArabic ? "صورة" : "Image"} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 200px) 100vw, 200px"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-2 left-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600"
                        title={isArabic ? "حذف الصورة" : "Delete image"}
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* الصور الجديدة */}
            {images.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-gray-700 mb-3">
                  {isArabic ? "الصور الجديدة:" : "New images:"}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square relative rounded-lg overflow-hidden border border-gray-200">
                        <Image
                          src={URL.createObjectURL(img)}
                          alt={`${isArabic ? "صورة جديدة" : "New image"} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 200px) 100vw, 200px"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveNewImage(index)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                          title={isArabic ? "حذف الصورة" : "Delete image"}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                        {isArabic ? "جديد" : "New"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* زر رفع الصور */}
            <div
              onClick={triggerFileInput}
              className="border-3 border-dashed border-gray-300 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg, image/jpg, image/png, image/gif, image/webp, image/svg+xml"
                onChange={handleImageChange}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <FiImage size={28} className="text-primary" />
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isArabic 
                    ? "اسحب وأفلت الصور هنا أو انقر للاختيار"
                    : "Drag and drop images here or click to select"}
                </p>
                <p className="text-sm text-gray-500">
                  {isArabic 
                    ? "يمكنك رفع عدة صور مرة واحدة"
                    : "You can upload multiple images at once"}
                </p>
              </div>
            </div>
          </div>

          {/* أزرار الحفظ */}
          <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 border-2 border-gray-300 text-gray-700 rounded-xl py-4 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-primary text-white rounded-xl py-4 hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{isArabic ? "جاري الحفظ..." : "Saving..."}</span>
                </>
              ) : (
                <>
                  <FiCheck size={20} />
                  <span>
                    {service?.id 
                      ? (isArabic ? "تحديث الخدمة" : "Update Service")
                      : (isArabic ? "إنشاء الخدمة" : "Create Service")}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditServiceModal;