    import {useNavigate} from 'react-router-dom'

    const AlbumItem = ({image, name, desc, id}) => {

    const naviagate = useNavigate();

  return (
    <div onClick={() => naviagate(`/album/${id}`)} className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]'>
        <img src={image} alt="image"  className='rounded w-68 ' />
        <p className='font-bold mt-2 mb-1'>{name}</p>
        <p className='text-slate-200 text-sm' >{desc}</p>
    </div>
  )
}

export default AlbumItem
