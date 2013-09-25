package org.zanata.rest.enunciate;

import javax.ws.rs.Consumes;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path(VersionResource.SERVICE_PATH)
@org.codehaus.enunciate.modules.jersey.ExternallyManagedLifecycle
@Produces({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
@Consumes({ MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON })
interface VersionResource extends org.zanata.rest.service.VersionResource
{
}
