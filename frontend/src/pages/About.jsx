import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
  return (
    <div>

      <div className='text-2xl text-center pt-8 border-t'>
          <Title text1={'THƯƠNG HIỆU'} text2={'VÀ CÂU CHUYỆN'}></Title>
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="about_img" />
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          <p>CESPIN là một thương hiệu trang sức độc đáo, ra đời vào năm 2020, mang trong mình sự hòa quyện hoàn hảo giữa nghệ thuật chế tác truyền thống và phong cách hiện đại. Với sứ mệnh tôn vinh vẻ đẹp cá nhân qua từng món trang sức, CESPIN không chỉ là một thương hiệu mà còn là người bạn đồng hành giúp khách hàng kể những câu chuyện riêng bằng ngôn ngữ của kim loại quý, đá quý và thiết kế tinh tế.</p>
          <b className='text-gray-800'>Lịch sử hình thành và phát triển</b>
          <p>CESPIN được sáng lập bởi hai nhà thiết kế trẻ Nguyễn Hoàng Anh và HAVJPRO mang trong mình đầy đam mê cùng sự sáng tạo. Họ gặp nhau trong một buổi hội thảo về nghệ thuật tại Florence, Ý, vào cuối năm 2019. Một người là thợ kim hoàn xuất thân từ một gia đình chế tác trang sức lâu đời, người kia là nhà thiết kế công nghiệp yêu thích sự tối giản và hiện đại. Cảm hứng từ cuộc gặp gỡ này đã dẫn đến sự ra đời của CESPIN vào đầu năm 2020.</p>
          <b className='text-gray-800'>Sứ mệnh của chúng tôi</b>
          <p>Trong hành trình phát triển, CESPIN hướng đến trở thành một trong những thương hiệu trang sức toàn cầu, nổi tiếng với giá trị bền vững, chất lượng vượt trội, và sự sáng tạo không ngừng. Mỗi năm, hãng đều cam kết ra mắt những bộ sưu tập mang đậm dấu ấn cá nhân và tôn vinh vẻ đẹp độc đáo của mỗi con người.</p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'TẠI SAO NÊN'} text2={'LỰA CHỌN CHÚNG TÔI'}></Title>
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Luôn đảm bảo chất lượng:</b>
          <p>CESPIN cam kết sử dụng các loại kim loại và đá quý đạt tiêu chuẩn cao nhất, được tuyển chọn kỹ lưỡng từ các nguồn cung ứng bền vững. Chúng tôi không chỉ tạo ra trang sức đẹp mà còn đảm bảo trách nhiệm với môi trường và cộng đồng.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Mang lại sự tiện lợi:</b>
          <p>Mỗi sản phẩm của CESPIN được thiết kế tinh xảo với phong cách kết hợp giữa nghệ thuật truyền thống và sự hiện đại. Chúng tôi hiểu rằng mỗi người đều có một câu chuyện riêng, và CESPIN sẵn sàng giúp bạn kể câu chuyện ấy qua từng món trang sức mang đậm dấu ấn cá nhân.</p>
        </div>
        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Dịch vụ chăm sóc khách hàng đặc biệt:</b>
          <p>Tại CESPIN, bạn luôn được lắng nghe và phục vụ với sự tận tâm cao nhất. Chúng tôi cung cấp dịch vụ tư vấn chuyên nghiệp, chính sách bảo hành dài hạn, và hỗ trợ tùy chỉnh thiết kế để phù hợp với mong muốn của bạn.</p>
        </div>
      </div>

      <NewsletterBox></NewsletterBox>

    </div>
  )
}

export default About