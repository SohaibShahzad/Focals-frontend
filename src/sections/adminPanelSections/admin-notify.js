// Helper function to determine if a field is date-related
const isDateField = (field) => {
  return field.toLowerCase().includes("date");
};

// Helper function to format dates
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Helper function to capitalize the first letter of each word
const capitalizeField = (field) => {
  return field.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
};

export const AdminNotify = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  return (
    <div className="absolute top-10 right-5 mt-2 p-3 w-[225px] sm:w-[300px] glassmorphism rounded-lg shadow-lg z-50 navbar-sm-animation h-72 overflow-y-auto">
      <ul className="list-none">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <li
              key={notification._id}
              className={`border-b border-gray-200 px-4 py-3 ${
                notification.isRead ? "opacity-50" : ""
              }`}
            >
              <div className="flex justify-between items-center">
                <h4
                  className={`text-md font-semibold ${
                    notification.isRead ? "text-gray-500" : "text-orange-500"
                  }`}
                >
                  {notification.title}
                </h4>
              </div>
              {notification.changes.length > 0 && (
                <div className="text-xs text-gray-500">
                  {notification.changes.map((change, index) => (
                    <p key={index}>
                      <span className="font-semibold">
                        {capitalizeField(change.field)}
                      </span>
                      from
                      <span className="font-semibold">
                        "
                        {isDateField(change.field)
                          ? formatDate(change.oldValue)
                          : change.oldValue}
                        "
                      </span>
                      to
                      <span className="font-semibold">
                        "
                        {isDateField(change.field)
                          ? formatDate(change.newValue)
                          : change.newValue}
                        "
                      </span>
                    </p>
                  ))}
                </div>
              )}
              <div className="mt-2 flex justify-between items-center">
                {!notification.isRead && (
                  <button
                    onClick={() => onMarkAsRead(notification._id)}
                    className="text-xs text-orange-500 hover:text-orange-700"
                  >
                    Mark as read
                  </button>
                )}
                {/* <button className="text-xs text-white bg-orange-600 hover:bg-orange-700 rounded px-2 py-1">
                  View Details
                </button> */}
              </div>
            </li>
          ))
        ) : (
          <div className="text-center text-sm text-gray-500 p-3">
            No new notifications
          </div>
        )}
      </ul>
      {notifications.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={onMarkAllAsRead}
            className="text-xs text-orange-600 hover:text-orange-800 p-2"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
};
