function SkeletonPleaseWait() {
  return (
    <div className="flex items-center gap-3 text-gray-500">
      <div className="loader-please-wait" />
      <small className="text-gray-500">
        Fetching data please wait
        <span className="dot-anim inline-block ml-1">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </small>
    </div>
  );
}

export default SkeletonPleaseWait;
