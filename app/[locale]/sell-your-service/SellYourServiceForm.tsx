'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import Container from '@/components/shared/container';
import InputComponent from '@/components/shared/reusableComponents/InputComponent';
import CustomSelect from '@/components/shared/reusableComponents/CustomSelect';
import { toast } from 'react-toastify';
import { FiUploadCloud } from 'react-icons/fi';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import apiServiceCall from '@/lib/apiServiceCall';

type FormValues = {
  catalog_category_id: string;
  title_ar: string;
  title_en: string;
  content_ar: string;
  content_en: string;
  features: { value: string }[];
  price: string;
  phone: string;
  mobile: string;
  images: File[];
};

// نوع بيانات القسم من API
type Category = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export default function SellYourService({token} : {token : string}) {
  const t = useTranslations('sellService');
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { 
    register, 
    control, 
    handleSubmit, 
    setValue, 
    reset,
    formState: { errors } 
  } = useForm<FormValues>({
    defaultValues: {
      features: [{ value: '' }],
      images: [],
      catalog_category_id: '',
      title_ar: '',
      title_en: '',
      content_ar: '',
      content_en: '',
      price: '',
      phone: '',
      mobile: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  });

  /* ================= جلب الأقسام من API ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // استدعاء API للحصول على الأقسام
        const response = await apiServiceCall({
          url: 'categories',
          method: 'GET',
        });
        
        if (response.status_code === 200) {
          setCategories(response.data);
        } else {
          toast.error(t('categoriesLoadError') || 'Failed to load categories');
        }
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        toast.error(error?.data?.message || t('categoriesLoadError') || 'Error loading categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /* ================= Image Upload ================= */
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleImageChange = (files: FileList) => {
  const fileArray = Array.from(files);
  
  // الحصول على الصور الحالية
  const currentImages = control._formValues.images || [];
  
  // الحد الأقصى 5 صور
  const remainingSlots = 5 - currentImages.length;
  const filesToAdd = fileArray.slice(0, remainingSlots);
  
  if (filesToAdd.length === 0) {
    toast.warning(t('maxImagesWarning') || 'يمكنك رفع حتى 5 صور فقط');
    return;
  }
  
  // تحديث قيمة images في الفورم
  const updatedImages = [...currentImages, ...filesToAdd];
  setValue('images', updatedImages);
  
  // تنظيف المعاينات السابقة
  previews.forEach(url => URL.revokeObjectURL(url));
  
  // إنشاء معاينات جديدة للصور المضافة
  const previewUrls = filesToAdd.map(file => URL.createObjectURL(file));
  setPreviews([...previews, ...previewUrls]);
  
  // تنظيف input file
  if (fileRef.current) {
    fileRef.current.value = '';
  }
};

  const removeImage = (index: number) => {
    const newImages = [...previews];
    URL.revokeObjectURL(newImages[index]);
    newImages.splice(index, 1);
    setPreviews(newImages);
    
    // تحديث قيمة images في الفورم
    const currentImages = control._formValues.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue('images', updatedImages);
  };

// ================= Submit =================
const onSubmit = async (data: FormValues) => {
  try {
    setSubmitting(true);
    
    const formData = new FormData();
    
    // إضافة جميع الحقول المطلوبة
    formData.append('catalog_category_id', data.catalog_category_id);
    formData.append('title[ar]', data.title_ar);
    formData.append('title[en]', data.title_en);
    formData.append('content[ar]', data.content_ar);
    formData.append('content[en]', data.content_en);
    formData.append('price', data.price);
    formData.append('phone', data.phone);
    formData.append('mobile', data.mobile);
    
    // إضافة الميزات
    data.features.forEach((feature, index) => {
      if (feature.value.trim()) {
        formData.append(`features[${index}]`, feature.value);
      }
    });
    
    // إضافة الصور بطريقة صحيحة
    // تأكد من أن data.images موجودة وليست فارغة
    if (data.images && data.images.length > 0) {
      // استخدم forEach لإضافة كل صورة
      data.images.forEach((image, index) => {
        if (image instanceof File) {
          formData.append(`images[${index}]`, image); // أو formData.append('images[]', image);
        }
      });
    }
    
    // تسجيل البيانات للتحقق (للتdebugging فقط)
    console.log('Submitting form data:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value, value instanceof File ? `File: ${value.name}` : '');
    }
    
    // هنا رفع البيانات للخادم
    const response = await apiServiceCall({
      url: 'user/create/services', // تأكد من تعديل الرابط حسب API الخاص بك
      method: 'POST',
      body: formData,
      headers: {
          'Content-Type': 'multipart/form-data',
  
        Authorization: `Bearer ${token}`
      },
    });
    
    if (response.status_code === 200 || response.status_code === 201) {
      toast.success(t('success'));
      
      // إعادة تعيين الفورم
      reset();
      setPreviews([]);
      previews.forEach(url => URL.revokeObjectURL(url));
      
      // إعادة ضبط الحقول
      setValue('features', [{ value: '' }]);
      setValue('images', []);
    } else {
      toast.error(response.message || t('submitError') || 'Failed to submit');
    }
    
  } catch (error: any) {
    console.error('Error submitting form:', error);
    
    // عرض رسالة الخطأ من السيرفر
    if (error?.data?.message) {
      toast.error(error.data.message);
    } else if (error?.data?.errors) {
      // إذا كان هناك أخطاء تحقق
      Object.values(error.data.errors).forEach((err: any) => {
        if (Array.isArray(err)) {
          err.forEach(msg => toast.error(msg));
        } else {
          toast.error(err);
        }
      });
    } else {
      toast.error(t('submitError') || 'An error occurred while submitting');
    }
  } finally {
    setSubmitting(false);
  }
};

  // تحويل البيانات للـ Select
  const categoryOptions = categories.map(category => ({
    value: category.id.toString(), // تحويل ID إلى string
    label: category.name, // استخدام الاسم مباشرة
  }));

  return (
    <Container>
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-md mt-10">
        <h1 className="text-2xl font-bold mb-8 text-center">
          {t('title')}
        </h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* ================= Top Section ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Image Upload */}
            <div>
              <div 
                onClick={() => fileRef.current?.click()}
                className="cursor-pointer border-2 border-dashed rounded-2xl flex flex-col items-center justify-center min-h-[260px] bg-[#fafafa] hover:border-primary transition relative"
              >
                {previews.length > 0 ? (
                  <div className="w-full p-4">
                    <div className="grid grid-cols-2 gap-2">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative h-32 group">
                          <Image 
                            src={preview} 
                            alt={`service image ${index + 1}`}
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                    {previews.length < 5 && (
                      <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">يمكنك إضافة المزيد من الصور</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <FiUploadCloud size={40} className="text-primary mb-3" />
                    <p className="font-medium">{t('uploadImage')}</p>
                    <span className="text-sm text-gray-400">
                      {t('imageFormats')}
                    </span>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => e.target.files && handleImageChange(e.target.files)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">يمكنك رفع حتى 5 صور</p>
            </div>

            {/* Basic Info */}
            <div className="flex flex-col gap-5">
              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  {t('category')}
                </label>
                {loading ? (
                  <div className="bg-[#f5f5f5] h-[50px] rounded-xl flex items-center justify-center">
                    <span className="text-gray-500">جاري تحميل الأقسام...</span>
                  </div>
                ) : (
                  <CustomSelect
                    control={control}
                    name="catalog_category_id"
                    placeholder="اختر القسم"
                    options={categoryOptions}
                    rules={{ required: t('categoryRequired') || "Category is required" }}
                  />
                )}
                {errors.catalog_category_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.catalog_category_id.message}
                  </p>
                )}
              </div>

              <InputComponent
                register={register}
                name="title_ar"
                placeholder={t('titleAr')}
                error={errors.title_ar?.message}
                rules={{ 
                  required: t('titleArRequired') || "Arabic title is required",
                  minLength: {
                    value: 3,
                    message: t('titleShort') || "Title is too short"
                  }
                }}
              />

              <InputComponent
                register={register}
                name="title_en"
                placeholder={t('titleEn')}
                error={errors.title_en?.message}
                rules={{ 
                  required: t('titleEnRequired') || "English title is required",
                  minLength: {
                    value: 3,
                    message: t('titleShort') || "Title is too short"
                  }
                }}
              />
            </div>
          </div>

          {/* ================= Content Sections ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Arabic Content */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {t('contentAr')}
              </label>
              <textarea
                {...register('content_ar', {
                  required: t('contentRequired'),
                  minLength: {
                    value: 10,
                    message: t('descriptionShort'),
                  },
                  maxLength: {
                    value: 1000,
                    message: t('descriptionLong') || "Content is too long",
                  },
                })}
                placeholder={t('contentArPlaceholder') || "أدخل المحتوى باللغة العربية..."}
                className="bg-[#f5f5f5] p-4 h-[150px] rounded-xl outline-none w-full resize-none"
              />
              {errors.content_ar && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content_ar.message}
                </p>
              )}
            </div>

            {/* English Content */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                {t('contentEn')}
              </label>
              <textarea
                {...register('content_en', {
                  required: t('contentRequired'),
                  minLength: {
                    value: 10,
                    message: t('descriptionShort'),
                  },
                  maxLength: {
                    value: 1000,
                    message: t('descriptionLong') || "Content is too long",
                  },
                })}
                placeholder={t('contentEnPlaceholder') || "Enter content in English..."}
                className="bg-[#f5f5f5] p-4 h-[150px] rounded-xl outline-none w-full resize-none"
              />
              {errors.content_en && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.content_en.message}
                </p>
              )}
            </div>
          </div>

          {/* ================= Contact Information ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputComponent
              register={register}
              name="phone"
              type="number"
              placeholder={t('phone')}
              error={errors.phone?.message}
              rules={{ 
                required: t('phoneRequired') || "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: t('phoneInvalid') || "Enter a valid phone number"
                }
              }}
            />

            <InputComponent
              register={register}
              name="mobile"
              type="number"
              placeholder={t('mobile')}
              error={errors.mobile?.message}
              rules={{ 
                required: t('mobileRequired') || "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: t('mobileInvalid') || "Enter a valid mobile number"
                }
              }}
            />

            <InputComponent
              register={register}
              name="price"
              type="number"
              placeholder={t('price')}
              error={errors.price?.message}
              className="md:col-span-2"
              rules={{ 
                required: t('priceRequired') || "Price is required",
                min: { 
                  value: 0, 
                  message: t('priceInvalid') || "Price must be positive" 
                },
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: t('priceFormat') || "Invalid price format"
                }
              }}
            />
          </div>

          {/* ================= Features ================= */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">
              {t('featuresTitle')}
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2">
                  <input
                    {...register(`features.${index}.value`, {
                      required: index === 0 ? t('featureRequired') || "At least one feature is required" : false,
                    })}
                    placeholder={`${t('feature')} ${index + 1}`}
                    className="bg-[#f5f5f5] h-[50px] rounded-xl px-4 w-full outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="text-red-500 font-bold w-10 h-[50px] rounded-xl bg-red-50 hover:bg-red-100 transition flex items-center justify-center"
                      title={t('removeFeature') || "Remove feature"}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => append({ value: '' })}
              className="mt-4 text-primary font-bold hover:text-primary-dark transition flex items-center gap-2"
            >
              <span>+</span>
              <span>{t('addFeature')}</span>
            </button>
          </div>

          {/* ================= Submit ================= */}
          <button
            type="submit"
            disabled={submitting || loading}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                <span>{t('submitting') || 'Submitting...'}</span>
              </>
            ) : (
              t('submit')
            )}
          </button>
        </form>
      </div>
    </Container>
  );
}