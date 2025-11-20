# Firestore Security Rules - TEMPORARY FOR TESTING

**⚠️ WARNING: These rules allow public read/write access. Use ONLY for testing!**

## Instructions

1. Go to Firebase Console → Firestore Database → Rules
2. Replace existing rules with the following:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper function to check if user is admin
    function isAdmin() {
      return request.auth != null && request.auth.token.email == 'harisjosinpeter@gmail.com';
    }
    
    // Blog posts - public read, admin write
    match /posts/{postId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Projects - public read, admin write
    match /projects/{projectId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Experiences - public read, admin write
    match /experiences/{experienceId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Comments - TEMPORARY: Allow all for testing
    match /comments/{commentId} {
      allow read: if true;  // Anyone can read
      allow create: if true;  // Anyone can create (TEMPORARY)
      allow update, delete: if isAdmin();  // Only admin can update/delete
    }
    
    // Settings - public read, admin write
    match /settings/{settingId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## After Testing

Once comments are working, update the `comments` rules to:

```javascript
match /comments/{commentId} {
  allow read: if resource.data.deleted == false || isAdmin();
  
  allow create: if request.resource.data.keys().hasAll(['postId', 'author', 'content', 'createdAt'])
                && request.resource.data.author.keys().hasAll(['name', 'email'])
                && request.resource.data.content.size() > 0
                && request.resource.data.content.size() <= 1000;
  
  allow update, delete: if isAdmin();
}
```

## Testing Checklist

- [ ] Apply temporary rules
- [ ] Try posting a comment
- [ ] Try creating an experience
- [ ] Check browser console for errors
- [ ] Verify data appears in Firestore
- [ ] Verify data displays on page
- [ ] Apply production rules after testing
